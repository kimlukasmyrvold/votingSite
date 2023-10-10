<%@ Page Title="Personer" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="VotingSite.pages.Personer.Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="false" AllowSorting="true" OnSorting="GridView1_Sorting">
        <Columns>
            <asp:BoundField DataField="FNavn" HeaderText="Fornavn" SortExpression="FNavn" />
            <asp:BoundField DataField="ENavn" HeaderText="Etternavn" SortExpression="ENavn" />
            <asp:BoundField DataField="FNum" HeaderText="Fødselsnummer" SortExpression="FNum" />
            <asp:BoundField DataField="Kommune" HeaderText="Kommune" SortExpression="Kommune" />
            <asp:BoundField DataField="Voted" HeaderText="Har stemt" SortExpression="Voted" />
        </Columns>
    </asp:GridView>
</asp:Content>
