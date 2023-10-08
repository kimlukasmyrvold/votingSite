using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace VotingSite.Statistikk
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                // Retrieve data from the SQL database
                DataTable dt = getFromStemmer();

                // Bind the data to the GridView
                GridView1.DataSource = dt;
                GridView1.DataBind();
            }
        }

        private DataTable getFromStemmer()
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