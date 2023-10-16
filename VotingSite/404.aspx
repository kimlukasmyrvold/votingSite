<%@ Page Title="404" Language="C#" MasterPageFile="~/Site.Master" CodeBehind="404.aspx.cs" Inherits="VotingSite._404" %>

<asp:Content ContentPlaceHolderID="HeadContent" runat="server">
    <style>main{display:flex;flex-direction:column;justify-content:center;align-items:center;align-self:center;margin:0 0 2em;padding:0}#errorTitle{font-size:clamp(4rem,-0.85rem + 40vw,14rem);font-weight:lighter}#siteNotFound{font-size:clamp(1.5rem,-0.85rem + 10vw,3rem);font-weight:300;margin:.4em 0}#goToPage{font-size:clamp(1.2rem,-0.85rem + 8vw,2rem);font-weight:300;margin:0}.errorLinks{display:flex;flex-direction:column;align-items:flex-start;align-self:center}.errorLinks a{font-size:1.3rem;text-decoration:underline;margin:.2em 0}@media(min-width: 600px){.errorLinks{flex-direction:row;justify-content:center;margin:0}.errorLinks a:not(:first-child)::before{content:"|";padding:0 10px;opacity:.7}}</style>
</asp:Content>

<asp:Content ContentPlaceHolderID="MainContent" runat="server">
    <span id="errorTitle">404</span>
    <h1 id="siteNotFound">Denne siden finnes ikke</h1>
    <h2 id="goToPage">Gå til en av disse sidene:</h2>
    <nav class="errorLinks" aria-label="Secondary navbar">
        <a runat="server" href="~/">Hjemmeside</a>
        <a runat="server" href="~/Charts/">Charts</a>
        <a runat="server" href="~/Stemmer/">Stemmer</a>
        <a runat="server" href="~/Kommuner/">Kommuner</a>
        <a runat="server" href="~/Partier/">Partier</a>
        <a runat="server" href="~/Personer/">Personer</a>
        <a runat="server" href="~/Privacy/">Privacy</a>
    </nav>
</asp:Content>