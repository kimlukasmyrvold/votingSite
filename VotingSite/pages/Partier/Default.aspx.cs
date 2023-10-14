using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace VotingSite.Partier
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                getFromPartier();
            }
        }

        private void getFromPartier()
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
            }

            // Bind the data to the GridView
            GridView1.DataSource = dt;
            GridView1.DataBind();
        }


    }
}