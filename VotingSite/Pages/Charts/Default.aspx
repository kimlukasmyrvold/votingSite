<%@ Page Title="Charts" Language="C#" MasterPageFile="~/Site.Master" CodeBehind="Default.aspx.cs" Inherits="VotingSite.Pages.Charts.Default" %>

<asp:Content ContentPlaceHolderID="MainContent" runat="server">
    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="false">
        <Columns>
            <asp:BoundField DataField="PID" HeaderText="ID" />
            <asp:BoundField DataField="Parti" HeaderText="Parti" />
        </Columns>
    </asp:GridView>

    <h1 id="count" runat="server">88</h1>
</asp:Content>