using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;

namespace VotingSite.Pages.Stemmer
{
    public partial class Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack) return;
            // Retrieve data from the SQL database
            DataTable dt = GetFromStemmer();

            // Bind the data to the GridView
            GridView1.DataSource = dt;
            GridView1.DataBind();
        }

        private static DataTable GetFromStemmer()
        {
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            DataTable dt = new DataTable();
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                //SqlCommand cmd = new SqlCommand("SELECT * from viewStemmerTest order by newid()", conn);
                SqlCommand cmd = new SqlCommand("SELECT Kommune,Parti from viewStemmer", conn);
                cmd.CommandType = CommandType.Text;
                SqlDataReader reader = cmd.ExecuteReader();
                dt.Load(reader);
                reader.Close();
                conn.Close();
                return dt;
            }
        }
    }
}