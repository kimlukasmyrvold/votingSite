using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace VotingSite.Pages.Personer
{
    public partial class Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                BindGridView("ID", SortDirection.Ascending);
            }
        }

        protected void GridView1_Sorting(object sender, GridViewSortEventArgs e)
        {
            string sortExpression = e.SortExpression;
            SortDirection sortDirection = GetSortDirection(sortExpression);

            BindGridView(sortExpression, sortDirection);
        }

        private void BindGridView(string sortExpression, SortDirection sortDirection)
        {
            DataTable dt = GetFromPersoner(sortExpression, sortDirection);

            GridView1.DataSource = dt;
            GridView1.DataBind();
        }

        private static DataTable GetFromPersoner(string sortExpression, SortDirection sortDirection)
        {
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            DataTable dt = new DataTable();
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                string query =
                    "SELECT FNavn,ENavn,FNum,Kommune,Voted FROM personer,kommuner where personer.KID=kommuner.KID";

                // Apply sorting
                query += " ORDER BY " + sortExpression;
                query += (sortDirection == SortDirection.Ascending) ? " ASC" : " DESC";

                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.Text;
                SqlDataReader reader = cmd.ExecuteReader();
                dt.Load(reader);
                reader.Close();
                conn.Close();
                return dt;
            }
        }

        private SortDirection GetSortDirection(string column)
        {
            // By default, set the sort direction to Ascending
            SortDirection sortDirection = SortDirection.Ascending;

            // Retrieve the last sort direction and column from the ViewState
            string lastColumnSorted = ViewState["SortExpression"] as string;
            SortDirection? lastDirection = ViewState["SortDirection"] as SortDirection?;

            // Toggle the sort direction if it's the same column being sorted
            if (!string.IsNullOrEmpty(lastColumnSorted) && lastColumnSorted == column)
            {
                sortDirection = (lastDirection == SortDirection.Ascending)
                    ? SortDirection.Descending
                    : SortDirection.Ascending;
            }

            // Save the new sort direction and column in ViewState
            ViewState["SortDirection"] = sortDirection;
            ViewState["SortExpression"] = column;

            return sortDirection;
        }


        private void SendToPersoner(string fNavn, string eNavn, string fNum, int kid)
        {
            // Checking if person already is in the database
            bool isInDb = PersonExists(fNum);
            if (isInDb)
            {
                Response.Redirect(Request.Url.AbsolutePath + "?r=Error, person er i database");
                return;
            }

            // Inserting the person into database
            var connectionString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(
                    "INSERT INTO personer (FNavn,ENavn,FNum,KID,Voted) Values(@FNavn,@ENavn,@FNum,@KID,1)", conn);
                cmd.CommandType = CommandType.Text;

                // Param for Fornavn
                var param = new SqlParameter("@FNavn", SqlDbType.VarChar);
                param.Value = fNavn;
                cmd.Parameters.Add(param);

                // Param for Etternavn
                param = new SqlParameter("@ENavn", SqlDbType.VarChar);
                param.Value = eNavn;
                cmd.Parameters.Add(param);

                // Param for Fødselsnummer
                param = new SqlParameter("@FNum", SqlDbType.VarChar);
                param.Value = fNum;
                cmd.Parameters.Add(param);

                // Param for Kommune ID
                param = new SqlParameter("@KID", SqlDbType.Int);
                param.Value = kid;
                cmd.Parameters.Add(param);

                cmd.ExecuteNonQuery();
                conn.Close();
            }
        }

        private static bool PersonExists(string fNum)
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

            // returns true if person exists in database
            return personExists;
        }

        protected void RemoveVoted_Click(object sender, EventArgs e)
        {
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connString))
            {
                con.Open();
                SqlCommand cmd = new SqlCommand("UPDATE personer SET Voted=0", con);
                cmd.CommandType = CommandType.Text;

                cmd.ExecuteNonQuery();
                con.Close();
            }

            Response.Redirect(Request.Url.AbsolutePath);
        }
    }
}