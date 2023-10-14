<%@ Page Title="Hjemmeside" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="VotingSite._Default" %>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContent" runat="server">
    <link rel="stylesheet" href="/assets/css/home.css">
    <script src="/assets/js/home.js" defer></script>
</asp:Content>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <p id="ErrMsg" runat="server"></p>

    <div class="partier">
        <div class="partier__container" id="partierContainer" runat="server"></div>
    </div>
</asp:Content>

<asp:Content ID="ModalContent" ContentPlaceHolderID="ModalContent" runat="server">
    <!-- Voting Form -->
    <div id="voteForm" data-visible="false">
        <div class="container no-margin">

            <div class="votingInfo">
                <div class="partiLogo">
                    <img src="/assets/images/parti_logos/.png" alt="Parti logo">
                </div>
                <p class="partiName">&nbsp</p>
            </div>

            <div class="personalInfo">
                <div class="selectFylker">
                    <p>Velg Fylke</p>
                    <asp:DropDownList ID="DropDownListFylker" runat="server" AutoPostBack="True" OnSelectedIndexChanged="GetFromKommuner_Click">
                        <asp:ListItem Selected="True" Value="0" Disabled="true">Velg Fylke...
                        </asp:ListItem>
                    </asp:DropDownList>
                </div>
                <div class="remains">
                    <div class="selectKommuner">
                        <p>Velg Kommune</p>
                        <div class="inputField">
                            <asp:DropDownList ID="DropDownListKommuner" runat="server">
                                <asp:ListItem Selected="True" Value="0" Disabled="true">Velg Kommune...
                                </asp:ListItem>
                            </asp:DropDownList>
                            <div class="validBox"><span class="validKommune"></span></div>
                        </div>
                    </div>

                    <%--<label for="FNavn">Fornavn:</label>
                <div class="inputField">
                    <input runat="server" type="text" id="FNavn" name="Fornavn" required title="Fornavn" pattern="(?![\s]+$)[a-zA-Z\u00C0-\u02AF\s]+">
                    <div class="validBox"><span class="validFNavn"></span></div>
                </div>

                <label for="ENavn">Etternavn:</label>
                <div class="inputField">
                    <input runat="server" type="text" id="ENavn" name="Etternavn" required title="Etternavn" pattern="(?![\s]+$)[a-zA-Z\u00C0-\u02AF\s]+">
                    <div class="validBox"><span class="validENavn"></span></div>
                </div>--%>

                    <label for="FNum">Fødselsnummer:</label>
                    <div class="inputField">
                        <input runat="server" type="text" id="FNum" name="Fødselsnummer" maxlength="11" placeholder="11 sifre..." required title="Fødselsnummer" pattern="(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])\d{2}\s?\d{5}">
                        <div class="validBox"><span class="validFNum"></span></div>
                    </div>
                </div>
            </div>

            <div class="buttons">
                <button class="cancel" type="button"><span>Avbryt</span></button>
                <button class="submit" type="submit"><span>Stem</span></button>
                <input type="hidden" id="hiddenDataField" runat="server" />
                <asp:Button CssClass="sendToStemmer hidden" ID="sendToStemmer"
                    OnClick="SendToStemmer_Click" runat="server" />
            </div>

        </div>
    </div>

    <!-- Thank you for voting -->
    <div id="voted" data-visible="false">
        <div class="container">
            <p class="title">Takk for at du stemmte!</p>
            <p class="results">
                <a href="#results">Se resultatene</a>
            </p>
        </div>
    </div>
</asp:Content>
