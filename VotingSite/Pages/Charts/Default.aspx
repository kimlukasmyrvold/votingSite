<%@ Page Title="Charts" Language="C#" MasterPageFile="~/Site.Master" CodeBehind="Default.aspx.cs" Inherits="VotingSite.Pages.Charts.Default" %>

<asp:Content ContentPlaceHolderID="HeadContent" runat="server">
    <link rel="stylesheet" href="/Content/CSS/charts.css" >
    <script src="/Content/JavaScript/charts.js" defer></script>
</asp:Content>

<asp:Content ContentPlaceHolderID="MainContent" runat="server">
    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="false">
        <Columns>
            <asp:BoundField DataField="PID" HeaderText="ID"/>
            <asp:BoundField DataField="Parti" HeaderText="Parti"/>
        </Columns>
    </asp:GridView>

    <h1 id="count" runat="server">123</h1>

    <asp:HiddenField ID="chartValues" runat="server"></asp:HiddenField>

    <hr>

    <asp:GridView ID="GridView_VoteCount" runat="server"></asp:GridView>
    <asp:GridView ID="GridView_VoteCountPercent" runat="server"></asp:GridView>

    <hr>

    <h1>Bar Chart</h1>

    <div class="chart__container"></div>

</asp:Content>