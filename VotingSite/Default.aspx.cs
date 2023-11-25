using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;

namespace VotingSite
{
    public class Parti
    {
        public string Name { get; set; }
        public string FullName { get; set; }
        public string Description { get; set; }
        public string Side { get; set; }
        public bool Disabled { get; set; }
    }

    public partial class Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            ClientScript.RegisterClientScriptBlock(GetType(), "IsPostBack", "var isPostBack = false;", true);

            if (Page.IsPostBack)
            {
                ClientScript.RegisterClientScriptBlock(GetType(), "IsPostBack", "var isPostBack = true;", true);
                return;
            }

            AddPartierItems();
            GetFromFylker();
            AddKommunerToDropDown();
        }

        private void AddKommunerToDropDown()
        {
            var dt = new DataTable();

            var connStr = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (var conn = new SqlConnection(connStr))
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "select stemmer.kid, kommune from stemmer, kommuner where stemmer.kid = kommuner.kid group by kommune, stemmer.kid ORDER BY kommune COLLATE Danish_Norwegian_CI_AS;",
                    conn);
                cmd.CommandType = CommandType.Text;

                var reader = cmd.ExecuteReader();
                dt.Load(reader);

                reader.Close();
                conn.Close();
            }

            foreach (DataRow row in dt.Rows)
            {
                var item = new ListItem(row["Kommune"].ToString(), row["KID"].ToString());
                kommunerDropDown.Items.Add(item);
            }

            kommunerDropDown.DataBind();
        }

        private static DataTable GetVoteCount()
        {
            var dt = new DataTable();

            var connStr = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (var conn = new SqlConnection(connStr))
            {
                conn.Open();
                var cmd = new SqlCommand("select * from VotesPerKommune order by votes desc;", conn);
                cmd.CommandType = CommandType.Text;

                var reader = cmd.ExecuteReader();
                dt.Load(reader);

                reader.Close();
                conn.Close();
            }

            return dt;
        }

        private static string GetChartValues()
        {
            var values = (from DataRow row in GetVoteCount().Rows
                select new
                {
                    Kid = (int)row["Kid"],
                    Kommune = row["Kommune"].ToString(),
                    Name = row["Parti"].ToString(),
                    Short = row["Short"].ToString(),
                    Color = row["Color"].ToString(),
                    Votes = row["Votes"].ToString(),
                }).ToArray();

            return JsonConvert.SerializeObject(values);
        }

        [WebMethod]
        public static string GetChartData()
        {
            return GetChartValues();
        }

        // **********************************************
        // *         Adding the parties to page         *
        // **********************************************

        private void AddPartierItems()
        {
            var jsonFilePath = Server.MapPath("~/Content/JSON/partier.json");
            dynamic jsonObj;
            using (var r = new StreamReader(jsonFilePath))
            {
                var json = r.ReadToEnd();
                jsonObj = new JavaScriptSerializer().Deserialize<dynamic>(json);
            }

            foreach (var partiEntry in jsonObj)
            {
                var partiId = int.Parse(partiEntry.Key);
                var parti = new Parti
                {
                    Name = partiEntry.Value["name"],
                    FullName = partiEntry.Value["fullName"],
                    Description = partiEntry.Value["description"],
                    Side = partiEntry.Value["side"]
                };

                if (partiEntry.Value.ContainsKey("disabled") && partiEntry.Value["disabled"] is bool &&
                    (bool)partiEntry.Value["disabled"]) continue;

                partierContainer.InnerHtml += $@"
                    <div class=""partier__item"" tabindex=""0"" data-id=""{partiId}"" data-side=""{parti.Side}"">
                        <div class=""partier__logo"">
                            <img src=""/Content/Images/PartyLogos/{parti.Name}.png"" alt=""Parti logo"">
                        </div>
                        <div class=""partier__content"">
                            <div class=""partier__name"">
                                <p>{parti.FullName}</p>
                                <hr>
                            </div>
                            <div class=""partier__description"">
                                <p>{parti.Description}</p>
                            </div>
                            <div class=""partier__vote"">
                                <button class=""button voteBtn"" tabindex=""0"" data-id=""{partiId}"">Stem på parti</button>
                            </div>
                        </div>
                    </div>
                ";
            }
        }


        // ***********************************************
        // *     Adding fylker from database to page     *
        // ***********************************************
        private void GetFromFylker()
        {
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            var dt = new DataTable();
            using (var conn = new SqlConnection(connString))
            {
                conn.Open();
                var cmd =
                    new SqlCommand("SELECT FID, Fylke from Fylker order by Fylke COLLATE Danish_Norwegian_CI_AS", conn);
                cmd.CommandType = CommandType.Text;
                var reader = cmd.ExecuteReader();
                dt.Load(reader);
                reader.Close();
                conn.Close();
            }

            foreach (DataRow row in dt.Rows)
            {
                var item = new ListItem(row["Fylke"].ToString(), row["FID"].ToString());
                DropDownListFylker.Items.Add(item);
            }

            DropDownListFylker.DataBind();
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
            var dt = new DataTable();
            using (var conn = new SqlConnection(connString))
            {
                conn.Open();
                var cmd =
                    new SqlCommand(
                        "SELECT KID, Kommune from Kommuner, Fylker where Kommuner.FID = Fylker.FID and Fylker.FID=@fid order by Kommune COLLATE Danish_Norwegian_CI_AS",
                        conn);
                cmd.CommandType = CommandType.Text;

                var param = new SqlParameter("@fid", SqlDbType.Int);
                param.Value = int.Parse(DropDownListFylker.SelectedValue);
                cmd.Parameters.Add(param);

                var reader = cmd.ExecuteReader();
                dt.Load(reader);
                reader.Close();
                conn.Close();
            }

            // Making the first row say "Velg Kommune..."
            var firstRow = new ListItem("Velg Kommune...", "0");
            DropDownListKommuner.Items.Add(firstRow);

            // Add the values to list
            foreach (DataRow row in dt.Rows)
            {
                var item = new ListItem(row["Kommune"].ToString(), row["KID"].ToString());
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


        // ********************************
        // *          Validation          *
        // ********************************

        // ======<   Checks if fnum is valid   >====== \\
        private static (bool, string) CheckFNum(string fnum)
        {
            // Check fnum with regex
            if (!Regex.IsMatch(fnum, @"^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])\d{7}$"))
            {
                return !Regex.IsMatch(fnum.Substring(0, 6), @"^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])\d{2}")
                    ? (false, "Dato på fødselsnummer er invalid.")
                    : (false, "Fødselsnummer kan bare være tall og må være 11 karakter lang.");
            }

            var fnumOk = false;

            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (var conn = new SqlConnection(connString))
            {
                conn.Open();
                var cmd = new SqlCommand("SELECT * from personer WHERE FNum = @FNum", conn);
                cmd.CommandType = CommandType.Text;

                var param = new SqlParameter("@FNum", SqlDbType.VarChar);
                param.Value = fnum;
                cmd.Parameters.Add(param);

                var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    fnumOk = true;
                }

                reader.Close();
                conn.Close();
            }

            return !fnumOk ? (false, "Fødselsnummer er ikke gyldig.") : (true, "");
        }

        // ======<   Checks if person has voted   >====== \\
        private static (bool, string) CheckVoted(string fNum)
        {
            var hasVoted = false;

            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (var conn = new SqlConnection(connString))
            {
                conn.Open();
                var cmd = new SqlCommand("SELECT * from personer WHERE FNum = @FNum AND Voted = 1", conn);
                cmd.CommandType = CommandType.Text;

                var param = new SqlParameter("@FNum", SqlDbType.VarChar);
                param.Value = fNum;
                cmd.Parameters.Add(param);

                var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    hasVoted = true;
                }

                reader.Close();
                conn.Close();
            }

            // returns false if person has voted
            return hasVoted ? (false, "Du har allerede stemt.") : (true, "");
        }

        // ======<   Checks if kommune is valid   >====== \\
        private (bool, string) CheckKommune(string fNum)
        {
            var isOk = false;
            if (int.Parse(DropDownListKommuner.SelectedValue) == 0) return (false, "Ingen Kommune Valgt");

            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (var conn = new SqlConnection(connString))
            {
                conn.Open();
                var cmd = new SqlCommand("SELECT * from personer WHERE FNum = @FNum AND KID = @KID", conn);
                cmd.CommandType = CommandType.Text;

                var param = new SqlParameter("@FNum", SqlDbType.VarChar);
                param.Value = fNum;
                cmd.Parameters.Add(param);

                param = new SqlParameter("@KID", SqlDbType.Int);
                param.Value = int.Parse(DropDownListKommuner.SelectedValue);
                cmd.Parameters.Add(param);

                var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    isOk = true;
                }

                reader.Close();
                conn.Close();
            }

            return (isOk, "Du hører ikke til valgt kommune");
        }

        // ======<   Checks if parti is valid   >====== \\
        private static (bool, string) CheckParti(string value)
        {
            var isOk = false;

            var pidOk = int.TryParse(value, out var pid);
            if (!pidOk) return (false, "Klarte ikke å få parti ID.");

            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (var conn = new SqlConnection(connString))
            {
                conn.Open();
                var cmd = new SqlCommand("SELECT * FROM partier WHERE PID = @PID", conn);
                cmd.CommandType = CommandType.Text;

                var param = new SqlParameter("@PID", SqlDbType.Int);
                param.Value = pid;
                cmd.Parameters.Add(param);

                var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    isOk = true;
                }

                reader.Close();
                conn.Close();
            }

            return (isOk, "Valgt parti finnes ikke.");
        }

        // ======<   Checking all values   >====== \\
        private (bool, string) CheckValues()
        {
            var fnum = FNum.Value.Replace(" ", "");

            var (fnumOk, fnumError) = CheckFNum(fnum);
            if (!fnumOk) return (false, fnumError);

            var (votedOk, votedError) = CheckVoted(fnum);
            if (!votedOk) return (false, votedError);

            var (kommuneOk, kommuneError) = CheckKommune(fnum);
            if (!kommuneOk) return (false, kommuneError);

            var (partiOk, partiError) = CheckParti(hiddenDataField.Value);
            if (!partiOk) return (false, partiError);

            return (true, "");
        }


        private void SendToStemmer()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();

                var cmd = new SqlCommand("INSERT INTO stemmer (KID,PID) Values(@kid,@pid)", conn);
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
            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();

                var cmd = new SqlCommand("UPDATE personer SET Voted = 1 WHERE FNum = @FNum", conn);
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
            var (isOk, errorMsg) = CheckValues();

            var script =
                $"document.addEventListener('DOMContentLoaded', () => {{SendToStemmer_Click_Callback(\"{(isOk ? "noError" : errorMsg)}\");}});";
            ScriptManager.RegisterStartupScript(this, GetType(), "callFunction", script, true);

            if (!isOk) return;

            SendToStemmer();
            AddVotedToPerson();
            Response.Redirect(Request.Url.AbsolutePath + "?r=moRe&er=noError");
        }
    }
}