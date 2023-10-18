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

            int countValue = CountPartier();
            count.InnerHtml = Server.HtmlEncode(countValue.ToString());

            List<int> chartValuesList = new List<int> { 1, 5, 2, 72, 878, 12, 43 };
            SetChartValues(chartValuesList);
        }

        private void SetChartValues(IReadOnlyCollection<int> values)
        {
            var jsonArray = JsonConvert.SerializeObject(values);
            chartValues.Value = jsonArray;
        }

        private void BindPartierTable()
        {
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            DataTable dt = new DataTable();
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * from partier", conn);
                cmd.CommandType = CommandType.Text;
                SqlDataReader reader = cmd.ExecuteReader();
                dt.Load(reader);
                
                GridView1.DataSource = dt;
                GridView1.DataBind();
                
                reader.Close();
                conn.Close();
            }
        }

        private static int CountPartier()
        {
            int count = 0;

            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT count(Parti) from partier", conn);
                cmd.CommandType = CommandType.Text;

                SqlDataReader reader = cmd.ExecuteReader();
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
            bool personExists = false;

            // Get persons from database
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