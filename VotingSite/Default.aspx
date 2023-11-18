<%@ Page Title="Hjemmeside" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="VotingSite.Default" %>

<asp:Content ContentPlaceHolderID="HeadContent" runat="server">
    <link rel="stylesheet" href="/Content/CSS/home.css">
    <link rel="stylesheet" href="/Content/CSS/charts.css">

    <script src="/Content/JavaScript/dist/jquery.min.js" defer></script>
    <script src="/Content/JavaScript/home.js" defer></script>
    <script src="/Content/JavaScript/charts.js" defer></script>
</asp:Content>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <p class="heading">Valg <span id="year" runat="server">2023</span></p>

    <div class="partier">
        <p>Trykk på de forskjellige partiene for å kunne lese mer om partiet eller stemme på det.</p>
        <div class="partier__container" id="partierContainer" runat="server"></div>
    </div>

    <div id="results">
        <p class="title">Resultater:</p>
        <div class="barChart">
            <div class="controls">
                <button class="button selected" data-option="percent">%</button>
                <button class="button" data-option="votes">Stemmer</button>
                <div class="custom_select">
                    <asp:DropDownList ID="kommunerDropDown" runat="server">
                        <asp:ListItem Value="0">Alle kommuner</asp:ListItem>
                    </asp:DropDownList>
                </div>
            </div>
            <div class="container"></div>
        </div>
    </div>
</asp:Content>

<asp:Content ID="ModalContent" ContentPlaceHolderID="ModalContent" runat="server">
    <!-- Voting Form -->
    <div id="vote_form" data-visible="false">
        <div class="container no-margin">

            <div class="votingInfo">
                <div class="partiLogo">
                    <img src="/Content/Images/PartyLogos/r.png" alt="Parti logo">
                </div>
                <p class="partiName"></p>
            </div>

            <div class="personalInfo">
                <div class="selectFylker">
                    <p>Velg Fylke</p>
                    <div class="inputField">
                        <asp:DropDownList ID="DropDownListFylker" runat="server" AutoPostBack="True" OnSelectedIndexChanged="GetFromKommuner_Click">
                            <asp:ListItem Selected="True" Value="0" Disabled="true">Velg Fylke...</asp:ListItem>
                        </asp:DropDownList>
                        <div class="validBox">
                            <span class="validFylke"></span>
                        </div>
                    </div>
                </div>
                <div class="remains">
                    <div class="selectKommuner">
                        <p>Velg Kommune</p>
                        <div class="inputField">
                            <asp:DropDownList ID="DropDownListKommuner" runat="server">
                                <asp:ListItem Selected="True" Value="0" Disabled="true">Velg Kommune...</asp:ListItem>
                            </asp:DropDownList>
                            <div class="validBox">
                                <span class="validKommune"></span>
                            </div>
                        </div>
                    </div>

                    <label for="FNum">Fødselsnummer:</label>
                    <div class="inputField">
                        <input runat="server" type="text" id="FNum" name="Fødselsnummer" maxlength="11" placeholder="11 sifre..." required title="Fødselsnummer" pattern="(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])\d{2}\s?\d{5}"/>
                        <div class="validBox">
                            <span class="validFNum"></span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="buttons">
                <button class="button cancel clr-destructive" type="button">Avbryt</button>
                <button class="button submit" type="submit">Stem</button>
                <asp:HiddenField runat="server" ID="hiddenDataField"></asp:HiddenField>
                <asp:Button CssClass="sendToStemmer hidden" ID="sendToStemmer" OnClick="SendToStemmer_Click" runat="server"/>
            </div>

        </div>
    </div>

    <!-- Comfirm Vote -->
    <div id="vote_confirm" data-visible="false">
        <div class="container">
            <p class="title">Er du sikker på at du vil stemme på <span class="parti_name">parti</span>?</p>
            <div class="buttons">
                <div class="button clr-destructive" id="cancel">Nei</div>
                <div class="button" id="confirm">Ja</div>
            </div>
        </div>
    </div>

    <!-- Result of sending vote -->
    <div id="vote_result" data-visible="false">
        <div class="container" data-visible="false" data-result="success">
            <p class="title">Takk for at du brukte stemmen din!</p>
            <p class="feedback">Din stemme ble sendt.</p>
            <p class="results">
                <a href="#results">Se resultatene</a>
            </p>
        </div>
        <div class="container" data-visible="false" data-result="error">
            <p class="title">Error: <span id="errorMsg"></span></p>
            <p class="feedback">Din stemme ble ikke sendt.</p>
            <p class="results">
                <a href="#results">Se resultatene</a>
            </p>
        </div>
    </div>
</asp:Content>