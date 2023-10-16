using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;

namespace VotingSite.Pages.Charts
{
    public partial class Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Page.IsPostBack) return;
            DataTable dt = GetFromPartier();
            GridView1.DataSource = dt;
            GridView1.DataBind();

            int countValue = CountPartier();
            count.InnerHtml = Server.HtmlEncode(countValue.ToString());
        }

        private static DataTable GetFromPartier()
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
                reader.Close();
                conn.Close();
                return dt;
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