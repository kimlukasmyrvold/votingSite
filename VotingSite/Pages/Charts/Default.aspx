<%@ Page Title="Charts" Language="C#" MasterPageFile="~/Site.Master" CodeBehind="Default.aspx.cs" Inherits="VotingSite.Pages.Charts.Default" %>

<asp:Content ContentPlaceHolderID="HeadContent" runat="server">
    <script src="/Content/JavaScript/charts.js" defer></script>
</asp:Content>

<asp:Content ContentPlaceHolderID="MainContent" runat="server">
    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="false">
        <Columns>
            <asp:BoundField DataField="PID" HeaderText="ID" />
            <asp:BoundField DataField="Parti" HeaderText="Parti" />
        </Columns>
    </asp:GridView>

    <h1 id="count" runat="server">123</h1>
    <asp:HiddenField ID="chartValues" runat="server"></asp:HiddenField>
</asp:Content>