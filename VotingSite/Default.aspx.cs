using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace VotingSite
{
    public partial class Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.QueryString.Count > 0)
            {
                ErrMsg.InnerHtml = Request.QueryString["r"];
            }

            if (Page.IsPostBack) return;
            AddPartierItems();
            GetFromFylker();
        }


        // **********************************************
        // *         Adding the parties to page         *
        // **********************************************

        private void AddPartierItems()
        {
            string jsonFilePath = Server.MapPath("~/Content/JSON/partier.json");
            dynamic jsonObj;
            using (StreamReader r = new StreamReader(jsonFilePath))
            {
                string json = r.ReadToEnd();
                jsonObj = new JavaScriptSerializer().Deserialize<dynamic>(json);
            }

            Dictionary<int, string> partiNamesFromDatabase = GetPartiNamesFromDatabase();

            foreach (var partiEntry in jsonObj)
            {
                var partiId = int.Parse(partiEntry.Key);
                var parti = new Parti
                {
                    Name = partiEntry.Value["name"],
                    FullName = partiEntry.Value["fullName"],
                    Description = partiEntry.Value["description"]
                };

                partierContainer.InnerHtml += $@"
                    <div class=""partier__item"" tabindex=""0"" data-id=""{partiId}"">
                        <div class=""partier__logo"">
                            <img src=""/Content/Images/PartyLogos/{parti.Name}.png"" alt=""Parti logo"">
                        </div>
                        <div class=""partier__content"">
                            <div class=""partier__name"">
                                <p>{(partiNamesFromDatabase.TryGetValue(partiId, out string value) ? value : parti.FullName)}</p>
                                <hr>
                            </div>
                            <div class=""partier__description"">
                                <p>{parti.Description}</p>
                            </div>
                            <div class=""partier__vote"">
                                <button class=""voteBtn"" tabindex=""0"" data-id=""{partiId}"">Stem på parti</button>
                            </div>
                        </div>
                    </div>
                ";
            }
        }

        private static Dictionary<int, string> GetPartiNamesFromDatabase()
        {
            Dictionary<int, string> partiNames = new Dictionary<int, string>();

            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT PID, Parti FROM partier", conn);
                cmd.CommandType = CommandType.Text;
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    int partiId = Convert.ToInt32(reader["PID"]);
                    string partiName = reader["Parti"].ToString();
                    partiNames.Add(partiId, partiName);
                }

                reader.Close();
            }

            return partiNames;
        }


        // ***********************************************
        // *     Adding fylker from database to page     *
        // ***********************************************
        private void GetFromFylker()
        {
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            DataTable dt = new DataTable();
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                SqlCommand cmd =
                    new SqlCommand("SELECT FID, Fylke from Fylker order by Fylke COLLATE Danish_Norwegian_CI_AS", conn);
                cmd.CommandType = CommandType.Text;
                SqlDataReader reader = cmd.ExecuteReader();
                dt.Load(reader);
                reader.Close();
                conn.Close();
            }

            foreach (DataRow row in dt.Rows)
            {
                ListItem item = new ListItem(row["Fylke"].ToString(), row["FID"].ToString());
                DropDownListFylker.Items.Add(item);
            }

            DropDownListFylker.DataBind();

            if (int.Parse(DropDownListKommuner.SelectedValue) != 0)
            {
                GetFromKommuner();
            }
        }


        // ***********************************************
        // *    Adding kommuner from database to page    *
        // ***********************************************
        protected void GetFromKommuner_Click(object sender, EventArgs e)
        {
            GetFromKommuner();
        }

        private void GetFromKommuner()
        {
            // Clear list to prevent duplicated values
            DropDownListKommuner.Items.Clear();

            // Get the values from database
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            DataTable dt = new DataTable();
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                SqlCommand cmd =
                    new SqlCommand(
                        "SELECT KID, Kommune from Kommuner, Fylker where Kommuner.FID = Fylker.FID and Fylker.FID=@fid order by Kommune COLLATE Danish_Norwegian_CI_AS",
                        conn);
                cmd.CommandType = CommandType.Text;

                var param = new SqlParameter("@fid", SqlDbType.Int);
                param.Value = int.Parse(DropDownListFylker.SelectedValue);
                cmd.Parameters.Add(param);

                SqlDataReader reader = cmd.ExecuteReader();
                dt.Load(reader);
                reader.Close();
                conn.Close();
            }

            // Making the first row say "Velg Kommune..."
            ListItem firstRow = new ListItem("Velg Kommune...", "0");
            DropDownListKommuner.Items.Add(firstRow);

            // Add the values to list
            foreach (DataRow row in dt.Rows)
            {
                ListItem item = new ListItem(row["Kommune"].ToString(), row["KID"].ToString());
                DropDownListKommuner.Items.Add(item);
            }

            // Bind the values
            DropDownListKommuner.DataBind();

            // Calling JavaScript 
            const string script = @"
                document.addEventListener('DOMContentLoaded', () => {
                    getFromKommuner_Callback();
                });
            ";
            ScriptManager.RegisterStartupScript(this, GetType(), "callFunctions", script, true);
        }


        // **********************************************
        // *   Check if person in database has voted    *
        // **********************************************
        private static bool CheckIfVoted(string fNum)
        {
            bool hasVoted = false;

            // Get persons from database
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * from personer WHERE FNum = @FNum AND Voted = 1", conn);
                cmd.CommandType = CommandType.Text;

                var param = new SqlParameter("@FNum", SqlDbType.VarChar);
                param.Value = fNum;
                cmd.Parameters.Add(param);

                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    // Checking if person exists within database
                    hasVoted = true;
                }

                reader.Close();
                conn.Close();
            }

            // returns true if person exists in database
            return hasVoted;
        }


        // ********************************************
        // *          Check if FNum is valid          *
        // ********************************************
        private static bool CheckFNum(string fNum)
        {
            const string pattern = @"^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])\d{7}$";
            bool regexOk = Regex.IsMatch(fNum, pattern);
            if (!regexOk) return false;
            bool fNumOk = false;

            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * from personer WHERE FNum = @FNum", conn);
                cmd.CommandType = CommandType.Text;

                var param = new SqlParameter("@FNum", SqlDbType.VarChar);
                param.Value = fNum;
                cmd.Parameters.Add(param);

                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    fNumOk = true;
                }

                reader.Close();
                conn.Close();
            }

            return fNumOk;
        }

        private bool CheckKommune(string fNum)
        {
            bool isOk = false;
            if (int.Parse(DropDownListKommuner.SelectedValue) == 0) return false;

            SqlParameter param;
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * from personer WHERE FNum = @FNum AND KID = @KID", conn);
                cmd.CommandType = CommandType.Text;

                param = new SqlParameter("@FNum", SqlDbType.VarChar);
                param.Value = fNum;
                cmd.Parameters.Add(param);

                param = new SqlParameter("@KID", SqlDbType.Int);
                param.Value = int.Parse(DropDownListKommuner.SelectedValue);
                cmd.Parameters.Add(param);

                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    isOk = true;
                }

                reader.Close();
                conn.Close();
            }

            return isOk;
        }

        private static bool CheckParti(string value)
        {
            bool isOk = false;

            bool pidOk = int.TryParse(value, out int pid);
            if (!pidOk) return false;

            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * FROM partier WHERE PID = @PID", conn);
                cmd.CommandType = CommandType.Text;

                var param = new SqlParameter("@PID", SqlDbType.Int);
                param.Value = pid;
                cmd.Parameters.Add(param);

                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    isOk = true;
                }

                reader.Close();
                conn.Close();
            }

            return isOk;
        }


        // ********************************************
        // *    Check all values if they are valid    *
        // ********************************************
        private bool CheckValues()
        {
            bool isOk = false;

            string fnum = FNum.Value.Replace(" ", "");
            bool fNumOk = CheckFNum(fnum);
            bool hasVoted = CheckIfVoted(fnum);
            bool kommuneOk = CheckKommune(fnum);
            bool partiOk = CheckParti(hiddenDataField.Value);

            // Clear error message field
            ErrMsg.InnerHtml = string.Empty;

            // Sending error if FNum is invalid
            if (!fNumOk)
            {
                ErrMsg.InnerHtml += "Error, fødselsnummer er ugyldig. ";
            }

            // Sending error if person has voted
            if (hasVoted)
            {
                ErrMsg.InnerHtml += "Error, du har allerede stemt. ";
            }

            // Checking if selected "kommune" is valid
            if (!kommuneOk)
            {
                ErrMsg.InnerHtml += "Error, feil eller ingen kommune valgt. ";
            }

            // Checking if selected "parti" is valid
            if (!partiOk)
            {
                ErrMsg.InnerHtml += "Error, parti finnes ikke. ";
            }

            // Checking if all values are valid
            if (fNumOk && !hasVoted && kommuneOk && partiOk)
            {
                isOk = true;
            }

            return isOk;
        }


        private void SendToStemmer()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("INSERT INTO stemmer (KID,PID) Values(@kid,@pid)", conn);
                cmd.CommandType = CommandType.Text;

                var param = new SqlParameter("@kid", SqlDbType.Int);
                param.Value = int.Parse(DropDownListKommuner.SelectedValue);
                cmd.Parameters.Add(param);

                param = new SqlParameter("@pid", SqlDbType.VarChar);
                param.Value = hiddenDataField.Value;
                cmd.Parameters.Add(param);

                cmd.ExecuteNonQuery();
                conn.Close();
            }
        }


        private void AddVotedToPerson()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("UPDATE personer SET Voted = 1 WHERE FNum = @FNum", conn);
                cmd.CommandType = CommandType.Text;

                var param = new SqlParameter("@FNum", SqlDbType.VarChar);
                param.Value = FNum.Value.Replace(" ", "");
                cmd.Parameters.Add(param);

                cmd.ExecuteNonQuery();
                conn.Close();
            }
        }


        // *******************************************
        // *          Send vote to database          *
        // *******************************************
        protected void SendToStemmer_Click(object sender, EventArgs e)
        {
            bool isOk = CheckValues();
            if (!isOk) return;
            SendToStemmer();
            AddVotedToPerson();
            Response.Redirect(Request.Url.AbsolutePath);
        }
    }

    public class Parti
    {
        public string Name { get; set; }
        public string FullName { get; set; }
        public string Description { get; set; }
    }
}