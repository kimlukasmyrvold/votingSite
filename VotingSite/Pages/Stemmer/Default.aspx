<%@ Page Title="Stemmer" Language="C#" MasterPageFile="~/Site.Master" CodeBehind="Default.aspx.cs" Inherits="VotingSite.Pages.Stemmer.Default" %>

<asp:Content ContentPlaceHolderID="MainContent" runat="server">
    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="false">
        <Columns>
            <asp:BoundField DataField="Kommune" HeaderText="Kommune" />
            <asp:BoundField DataField="Parti" HeaderText="Parti" />
        </Columns>
    </asp:GridView>
    
    <asp:Button Text="Clear Votes!" OnClick="ClearVotes" runat="server"></asp:Button>
</asp:Content>