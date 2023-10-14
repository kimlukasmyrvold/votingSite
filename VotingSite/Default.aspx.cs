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
    public class Parti
    {
        public string Name { get; set; }
        public string FullName { get; set; }
        public string Description { get; set; }
    }

    public partial class _Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.QueryString.Count > 0)
            {
                ErrMsg.InnerHtml = Request.QueryString["r"];
            }

            if (!Page.IsPostBack)
            {
                AddPartierItems();
                GetFromFylker();
            }

        }



        // **********************************************
        // *         Adding the parties to page         *
        // **********************************************

        private void AddPartierItems()
        {
            string jsonFilePath = Server.MapPath("~/assets/json/partier.json");
            dynamic jsonObj;
            using (StreamReader r = new StreamReader(jsonFilePath))
            {
                string json = r.ReadToEnd();
                jsonObj = new JavaScriptSerializer().Deserialize<dynamic>(json);
            }

            Dictionary<int, string> partiNamesFromDatabase = GetPartiNamesFromDatabase();

            foreach (var partiEntry in jsonObj)
            {
                var partiID = int.Parse(partiEntry.Key);
                var parti = new Parti
                {
                    Name = partiEntry.Value["name"],
                    FullName = partiEntry.Value["fullName"],
                    Description = partiEntry.Value["description"]
                };

                partierContainer.InnerHtml += $@"
                    <div class=""partier__item"" tabindex=""0"" data-id=""{partiID}"">
                        <div class=""partier__logo"">
                            <img src=""/assets/images/parti_logos/{parti.Name}.png"" alt=""Parti logo"">
                        </div>
                        <div class=""partier__content"">
                            <div class=""partier__name"">
                                <p>{(partiNamesFromDatabase.ContainsKey(partiID) ? partiNamesFromDatabase[partiID] : parti.FullName)}</p>
                                <hr>
                            </div>
                            <div class=""partier__description"">
                                <p>{parti.Description}</p>
                            </div>
                            <div class=""partier__vote"">
                                <button class=""voteBtn"" tabindex=""0"" data-id=""{partiID}"">Stem på parti</button>
                            </div>
                        </div>
                    </div>
                ";
            }

        }

        private Dictionary<int, string> GetPartiNamesFromDatabase()
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
                SqlCommand cmd = new SqlCommand("SELECT FID, Fylke from Fylker order by Fylke COLLATE Danish_Norwegian_CI_AS", conn);
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
            SqlParameter param;
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            DataTable dt = new DataTable();
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT KID, Kommune from Kommuner, Fylker where Kommuner.FID = Fylker.FID and Fylker.FID=@fid order by Kommune COLLATE Danish_Norwegian_CI_AS", conn);
                cmd.CommandType = CommandType.Text;

                param = new SqlParameter("@fid", SqlDbType.Int);
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
            string script = @"
                document.addEventListener('DOMContentLoaded', () => {
                    getFromKommuner_Callback();
                });
            ";
            ScriptManager.RegisterStartupScript(this, GetType(), "callFunctions", script, true);
        }



        // **********************************************
        // *   Check if person in database has voted    *
        // **********************************************

        private bool CheckIfVoted(string FNum)
        {
            bool hasVoted = false;

            // Get persons from database
            SqlParameter param;
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * from personer WHERE FNum = @FNum AND Voted = 1", conn);
                cmd.CommandType = CommandType.Text;

                param = new SqlParameter("@FNum", SqlDbType.VarChar);
                param.Value = FNum;
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

        private bool CheckFNum(string FNum)
        {
            string pattern = @"^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])\d{7}$";
            bool regexOK = Regex.IsMatch(FNum, pattern);
            if (!regexOK) return false;
            bool FNumOK = false;

            SqlParameter param;
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * from personer WHERE FNum = @FNum", conn);
                cmd.CommandType = CommandType.Text;

                param = new SqlParameter("@FNum", SqlDbType.VarChar);
                param.Value = FNum;
                cmd.Parameters.Add(param);

                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    FNumOK = true;
                }

                reader.Close();
                conn.Close();
            }

            return FNumOK;
        }

        private bool CheckKommune(string FNum)
        {
            bool isOK = false;
            if (int.Parse(DropDownListKommuner.SelectedValue) == 0) return isOK;

            SqlParameter param;
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * from personer WHERE FNum = @FNum AND KID = @KID", conn);
                cmd.CommandType = CommandType.Text;

                param = new SqlParameter("@FNum", SqlDbType.VarChar);
                param.Value = FNum;
                cmd.Parameters.Add(param);

                param = new SqlParameter("@KID", SqlDbType.Int);
                param.Value = int.Parse(DropDownListKommuner.SelectedValue);
                cmd.Parameters.Add(param);

                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    isOK = true;
                }
 
                reader.Close();
                conn.Close();
            }

            return isOK;
        }



        // ********************************************
        // *    Check all values if they are valid    *
        // ********************************************

        private bool CheckValues()
        {
            bool isOK = false;

            string FNUM = FNum.Value.Replace(" ", "");
            bool FNumIsOK = CheckFNum(FNUM);
            bool hasVoted = CheckIfVoted(FNUM);
            bool kommuneIsOK = CheckKommune(FNUM);
            bool partiIsOk = true;
            bool pidOK = int.TryParse(hiddenDataField.Value, out int PNum);

            // Clear error message field
            ErrMsg.InnerHtml = string.Empty;

            // Sending error if FNum is invalid
            if (!FNumIsOK)
            {
                ErrMsg.InnerHtml += "Error, fødselsnummer er ugyldig. ";
            }

            // Sending error if person has voted
            if (hasVoted)
            {
                ErrMsg.InnerHtml += "Error, du har allerede stemt. ";
            }

            // Checking if selected "kommune" is valid
            if (!kommuneIsOK)
            {
                ErrMsg.InnerHtml += "Error, feil eller ingen kommune valgt. ";
            }

            // Checking if selected "parti" is valid
            if (!pidOK || PNum < 1)
            {
                ErrMsg.InnerHtml += "Error, ingen parti valgt. ";
                partiIsOk = false;
            }

            // Checking if all values are valid
            if (FNumIsOK && !hasVoted && kommuneIsOK && partiIsOk)
            {
                isOK = true;
            }

            return isOK;
        }


        private void SendToStemmer()
        {
            SqlParameter param;
            var connectionString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("INSERT INTO stemmer (KID,PID) Values(@kid,@pid)", conn);
                cmd.CommandType = CommandType.Text;

                param = new SqlParameter("@kid", SqlDbType.Int);
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
            SqlParameter param;
            var connectionString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("UPDATE personer SET Voted = 1 WHERE FNum = @FNum", conn);
                cmd.CommandType = CommandType.Text;

                param = new SqlParameter("@FNum", SqlDbType.VarChar);
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
            bool isOK = CheckValues();
            if (!isOK) return;
            SendToStemmer();
            AddVotedToPerson();
            Response.Redirect(Request.Url.AbsolutePath);
        }


    }
}