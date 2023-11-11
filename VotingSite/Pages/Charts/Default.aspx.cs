using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;

namespace VotingSite.Pages.Charts
{
    public class PartyData
    {
        public int Kid { get; set; }
        public string Kommune { get; set; }
        public string Name { get; set; }
        public string Short { get; set; }
        public string Votes { get; set; }
        public double Percent { get; set; }
    }

    public partial class Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Page.IsPostBack) return;
            AddKommunerToDropDown();
            SetChartValues();
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

            var voteCount = dt.AsEnumerable().Sum(s => s.Field<int>("votes"));
            dt.Columns.Add("Percent", typeof(double));

            foreach (DataRow row in dt.Rows)
            {
                var percent = Convert.ToDouble(row["votes"]) / voteCount * 100.0;
                row["Percent"] = percent.ToString("N1");
            }

            return dt;
        }

        private void SetChartValues()
        {
            var values = (from DataRow row in GetVoteCount().Rows
                select new PartyData
                {
                    Kid = (int)row["Kid"],
                    Kommune = row["Kommune"].ToString(),
                    Name = row["Parti"].ToString(),
                    Short = row["Short"].ToString(),
                    Votes = row["Votes"].ToString(),
                    Percent = (double)row["Percent"]
                }).ToArray();

            var jsonArray = JsonConvert.SerializeObject(values);
            chartValues.Value = jsonArray;
        }
    }
}