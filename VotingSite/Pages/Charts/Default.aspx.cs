using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web.UI;
using Newtonsoft.Json;

namespace VotingSite.Pages.Charts
{
    public class PartyData
    {
        public string Name { get; set; }
        public double Percent { get; set; }
    }

    public partial class Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Page.IsPostBack) return;

            // Bind values from GetVotedCountPercent() to gridView
            var dt = GetVoteCountPercent();
            GridView_VoteCountPercent.DataSource = dt;
            GridView_VoteCountPercent.DataBind();

            // Add values to site so that JavaScript can use it.
            SetChartValues((from DataRow row in dt.Rows select new PartyData { Name = row["parti"].ToString(), Percent = (double)row["Percent"] }).ToArray());
        }

        private static DataTable GetVoteCount()
        {
            var dt = new DataTable();

            var connStr = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (var conn = new SqlConnection(connStr))
            {
                conn.Open();
                var cmd = new SqlCommand("select * from VoteCountByParti;", conn);
                cmd.CommandType = CommandType.Text;

                var reader = cmd.ExecuteReader();
                dt.Load(reader);

                reader.Close();
                conn.Close();
            }

            return dt;
        }

        private static DataTable GetVoteCountPercent()
        {
            var dt = GetVoteCount();
            var voteCount = dt.AsEnumerable().Sum(s => s.Field<int>("votes"));
            dt.Columns.Add("Percent", typeof(double));

            foreach (DataRow row in dt.Rows)
            {
                var percent = Convert.ToDouble(row["votes"]) / voteCount * 100.0;
                row["Percent"] = percent.ToString("N1");
            }

            return dt;
        }

        private void SetChartValues(IReadOnlyCollection<PartyData> values)
        {
            var jsonArray = JsonConvert.SerializeObject(values);
            chartValues.Value = jsonArray;
        }
    }
}