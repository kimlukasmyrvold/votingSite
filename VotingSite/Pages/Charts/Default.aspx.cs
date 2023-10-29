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
    public partial class Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Page.IsPostBack) return;
            BindPartierTable();

            var countValue = CountPartier();
            count.InnerHtml = Server.HtmlEncode(countValue.ToString());

            var chartValuesList = new List<int> { 1, 5, 2, 72, 878, 12, 43 };
            SetChartValues(chartValuesList);

            VoteCount("rødt");
            VoteCountPercent();
        }

        private void VoteCount(string parti = null, string kommune = null)
        {
            var connStr = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            var dt = new DataTable();
            using (var conn = new SqlConnection(connStr))
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "select * from VoteCountByKommuneAndParti where (@parti is null or parti = @parti) and (@kommune is null or kommune = @kommune);",
                    conn);
                cmd.CommandType = CommandType.Text;

                var partiParam = new SqlParameter("@parti", SqlDbType.VarChar);
                partiParam.Value = string.IsNullOrEmpty(parti) ? (object)DBNull.Value : parti;
                cmd.Parameters.Add(partiParam);

                var kommuneParam = new SqlParameter("@kommune", SqlDbType.VarChar);
                kommuneParam.Value = string.IsNullOrEmpty(kommune) ? (object)DBNull.Value : kommune;
                cmd.Parameters.Add(kommuneParam);

                var reader = cmd.ExecuteReader();
                dt.Load(reader);

                GridView_VoteCount.DataSource = dt;
                GridView_VoteCount.DataBind();

                reader.Close();
                conn.Close();
            }
        }

        private static DataTable VoteCountV2()
        {
            var dt = new DataTable();

            var connStr = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (var conn = new SqlConnection(connStr))
            {
                conn.Open();
                var cmd = new SqlCommand("select * from VoteCountByKommuneAndParti ", conn);
                cmd.CommandType = CommandType.Text;

                var reader = cmd.ExecuteReader();
                dt.Load(reader);

                reader.Close();
                conn.Close();
            }
            
            return dt;
        }

        private void VoteCountPercent()
        {
            var dt = VoteCountV2();
            var voteCount = dt.AsEnumerable().Sum(s => s.Field<int>("votes"));
            dt.Columns.Add("Percent", typeof(int));

            foreach (DataRow row in dt.Rows)
            {
                row["Percent"] = (double)(int)row["votes"] / voteCount * 100;
            }

            GridView_VoteCountPercent.DataSource = dt;
            GridView_VoteCountPercent.DataBind();
        }

        private void SetChartValues(IReadOnlyCollection<int> values)
        {
            var jsonArray = JsonConvert.SerializeObject(values);
            chartValues.Value = jsonArray;
        }

        private void BindPartierTable()
        {
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            var dt = new DataTable();
            using (var conn = new SqlConnection(connString))
            {
                conn.Open();
                var cmd = new SqlCommand("SELECT * from partier", conn);
                cmd.CommandType = CommandType.Text;
                var reader = cmd.ExecuteReader();
                dt.Load(reader);

                GridView1.DataSource = dt;
                GridView1.DataBind();

                reader.Close();
                conn.Close();
            }
        }

        private static int CountPartier()
        {
            var count = 0;

            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (var conn = new SqlConnection(connString))
            {
                conn.Open();
                var cmd = new SqlCommand("SELECT count(Parti) from partier", conn);
                cmd.CommandType = CommandType.Text;

                var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    count = reader.GetInt32(0);
                }

                reader.Close();
                conn.Close();
            }

            return count;
        }

        private bool GetFromPersoner(string fNum)
        {
            var personExists = false;

            // Get persons from database
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (var conn = new SqlConnection(connString))
            {
                conn.Open();
                var cmd = new SqlCommand("SELECT * from personer WHERE FNum = @FNum", conn);
                cmd.CommandType = CommandType.Text;

                var param = new SqlParameter("@FNum", SqlDbType.VarChar);
                param.Value = fNum;
                cmd.Parameters.Add(param);

                var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    // Checking if person exists within database
                    personExists = true;
                }

                reader.Close();
                conn.Close();
            }

            // return true if person exists in database
            return personExists;
        }
    }
}