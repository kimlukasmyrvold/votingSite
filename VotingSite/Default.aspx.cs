using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;

namespace VotingSite
{
    public partial class Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Page.IsPostBack) return;

            AddPartierToPage();
            AddFylkerToDropdown();
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

        [WebMethod]
        public static string GetChartData()
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


        private static PartyInfo[] GetPartiInfo()
        {
            var dt = new DataTable();

            var connStr = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (var conn = new SqlConnection(connStr))
            {
                conn.Open();
                var cmd = new SqlCommand("select * from partier;", conn);
                cmd.CommandType = CommandType.Text;

                var reader = cmd.ExecuteReader();
                dt.Load(reader);

                reader.Close();
                conn.Close();
            }

            var partier = (from DataRow row in dt.Rows
                select new PartyInfo
                {
                    Pid = (int)row["PID"],
                    Parti = row["Parti"].ToString(),
                    Short = row["Short"].ToString(),
                    Color = row["Color"].ToString(),
                    Description = row["description"].ToString(),
                    Side = (int)row["side"],
                }).ToArray();

            return partier;
        }

        public class PartyInfo
        {
            public int Pid { get; set; }
            public string Parti { get; set; }
            public string Short { get; set; }
            public string Color { get; set; }
            public string Description { get; set; }
            public int Side { get; set; }
        }

        [WebMethod]
        public static string GetPartiData()
        {
            return JsonConvert.SerializeObject(GetPartiInfo());
        }

        // **********************************************
        // *         Adding the parties to page         *
        // **********************************************
        private void AddPartierToPage()
        {
            foreach (var party in GetPartiInfo())
            {
                partierContainer.InnerHtml += $@"
                    <div class=""partier__item"" tabindex=""0"" data-id=""{party.Pid}"" data-side=""{party.Side}"">
                        <div class=""partier__logo"">
                            <img src=""/Content/Images/PartyLogos/{party.Short}.png"" alt=""Parti logo"">
                        </div>
                        <div class=""partier__content"">
                            <div class=""partier__name"">
                                <p>{party.Parti}</p>
                                <hr>
                            </div>
                            <div class=""partier__description"">
                                <p>{party.Description}</p>
                            </div>
                            <div class=""partier__vote"">
                                <button class=""button voteBtn"" tabindex=""0"" data-id=""{party.Pid}"">Stem på parti</button>
                            </div>
                        </div>
                    </div>
                ";
            }
        }


        // ***********************************************
        // *     Adding fylker from database to page     *
        // ***********************************************
        private void AddFylkerToDropdown()
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


        [WebMethod]
        public static string GetFromKommuner(int selectedFid)
        {
            var dt = new DataTable();
            var connStr = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (var conn = new SqlConnection(connStr))
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "SELECT KID, Kommune from Kommuner, Fylker where Kommuner.FID = Fylker.FID and Fylker.FID=@fid order by Kommune COLLATE Danish_Norwegian_CI_AS",
                    conn);
                cmd.CommandType = CommandType.Text;

                var param = new SqlParameter("@fid", SqlDbType.Int);
                param.Value = selectedFid;
                cmd.Parameters.Add(param);

                var reader = cmd.ExecuteReader();
                dt.Load(reader);
                reader.Close();
                conn.Close();
            }

            var values = (from DataRow row in dt.Rows
                select new
                {
                    Kid = (int)row["Kid"],
                    Kommune = row["Kommune"].ToString(),
                }).ToArray();

            return JsonConvert.SerializeObject(values);
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
                    ? (false, "Dato på fødselsnummer er ugyldig.")
                    : (false, "Fødselsnummer kan bare være tall og må være 11 karakterer lang.");
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
        private static (bool, string) CheckKommune(string fNum, string kommune)
        {
            var isOk = false;
            if (int.Parse(kommune) == 0) return (false, "Ingen Kommune Valgt");

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
                param.Value = int.Parse(kommune);
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
        private static (bool, string) CheckValues(VoteData jsonData)
        {
            var fnum = jsonData.Fnum;

            var (fnumOk, fnumError) = CheckFNum(fnum);
            if (!fnumOk) return (false, fnumError);

            var (votedOk, votedError) = CheckVoted(fnum);
            if (!votedOk) return (false, votedError);

            var (kommuneOk, kommuneError) = CheckKommune(fnum, jsonData.Kommune);
            if (!kommuneOk) return (false, kommuneError);

            var (partiOk, partiError) = CheckParti(jsonData.Pid);
            if (!partiOk) return (false, partiError);

            return (true, "");
        }


        private static void SendToStemmer(VoteData jsonData)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();

                var cmd = new SqlCommand("INSERT INTO stemmer (KID,PID) Values(@kid,@pid)", conn);
                cmd.CommandType = CommandType.Text;

                var param = new SqlParameter("@kid", SqlDbType.Int);
                param.Value = int.Parse(jsonData.Kommune);
                cmd.Parameters.Add(param);

                param = new SqlParameter("@pid", SqlDbType.VarChar);
                param.Value = jsonData.Pid;
                cmd.Parameters.Add(param);

                cmd.ExecuteNonQuery();
                conn.Close();
            }
        }

        private static void AddVotedToPerson(VoteData jsonData)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();

                var cmd = new SqlCommand("UPDATE personer SET Voted = 1 WHERE FNum = @FNum", conn);
                cmd.CommandType = CommandType.Text;

                var param = new SqlParameter("@FNum", SqlDbType.VarChar);
                param.Value = jsonData.Fnum;
                cmd.Parameters.Add(param);

                cmd.ExecuteNonQuery();
                conn.Close();
            }
        }


        public class VoteData
        {
            public string Pid { get; set; }
            public string Fylke { get; set; }
            public string Kommune { get; set; }
            public string Fnum { get; set; }
        }

        [WebMethod]
        public static (bool, string) Vote(string data)
        {
            var jsonData = JsonConvert.DeserializeObject<VoteData>(data);
            var (isOk, errorMsg) = CheckValues(jsonData);
            if (!isOk) return (false, errorMsg);

            SendToStemmer(jsonData);
            AddVotedToPerson(jsonData);

            return (true, "");
        }
    }
}