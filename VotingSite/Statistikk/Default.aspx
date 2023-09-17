<%@ Page Title="Statistikk" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="VotingSite.Statistikk.Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="false">
        <Columns>
            <asp:BoundField DataField="KID" HeaderText="KID" />
            <asp:BoundField DataField="KNavn" HeaderText="KNavn" />
            <asp:BoundField DataField="PID" HeaderText="PID" />
            <asp:BoundField DataField="PNavn" HeaderText="PNavn" />
        </Columns>
    </asp:GridView>
</asp:Content>
