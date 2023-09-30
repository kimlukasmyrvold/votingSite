<%@ Page Title="Statistikk" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="VotingSite.Statistikk.Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="false">
        <Columns>
            <asp:BoundField DataField="KID" HeaderText="Kommune ID" />
            <asp:BoundField DataField="Kommune" HeaderText="Kommune" />
            <asp:BoundField DataField="PID" HeaderText="Parti ID" />
            <asp:BoundField DataField="PNavn" HeaderText="Parti" />
        </Columns>
    </asp:GridView>
</asp:Content>
