using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace VotingSite.Pages.Kommuner
{
    public partial class Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Page.IsPostBack) return;
            BindGridView("KID", SortDirection.Ascending);
        }

        protected void GridView1_Sorting(object sender, GridViewSortEventArgs e)
        {
            string sortExpression = e.SortExpression;
            SortDirection sortDirection = GetSortDirection(sortExpression);

            BindGridView(sortExpression, sortDirection);
        }

        private void BindGridView(string sortExpression, SortDirection sortDirection)
        {
            DataTable dt = GetFromKommuner(sortExpression, sortDirection);

            GridView1.DataSource = dt;
            GridView1.DataBind();
        }

        //private DataTable getFromKommuner(bool orderByKommune)
        private static DataTable GetFromKommuner(string sortExpression, SortDirection sortDirection)
        {
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            DataTable dt = new DataTable();
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                string query = "SELECT KID, Kommune, Fylke FROM kommuner, fylker where kommuner.FID = fylker.FID";

                // Apply sorting
                query += " ORDER BY " + sortExpression;
                if (sortExpression != "KID")
                    query += " COLLATE Danish_Norwegian_CI_AS";
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
    }
}