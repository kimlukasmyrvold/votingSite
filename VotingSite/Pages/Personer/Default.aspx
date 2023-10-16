<%@ Page Title="Personer" Language="C#" MasterPageFile="~/Site.Master" CodeBehind="Default.aspx.cs" Inherits="VotingSite.Pages.Personer.Default" %>

<asp:Content ContentPlaceHolderID="MainContent" runat="server">
    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="false" AllowSorting="true" OnSorting="GridView1_Sorting">
        <Columns>
            <asp:BoundField DataField="FNavn" HeaderText="Fornavn" SortExpression="FNavn"/>
            <asp:BoundField DataField="ENavn" HeaderText="Etternavn" SortExpression="ENavn"/>
            <asp:BoundField DataField="FNum" HeaderText="Fødselsnummer" SortExpression="FNum"/>
            <asp:BoundField DataField="Kommune" HeaderText="Kommune" SortExpression="Kommune"/>
            <asp:BoundField DataField="Voted" HeaderText="Har stemt"/>
        </Columns>
    </asp:GridView>

    <asp:Button Text="RemoveVoted" OnClick="RemoveVoted_Click" runat="server"/>
</asp:Content>