<%@ Page Title="Hjemmeside" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="VotingSite._Default" %>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContent" runat="server">
    <link rel="stylesheet" href="assets/css/home.css">
    <script src="assets/js/home.js" defer></script>
</asp:Content>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <p id="ErrMsg" runat="server"></p>

    <div class="modal" data-visible="false">
        <div class="modal__container">
            <div class="close-icon">
                <svg class="icon-cross"></svg>
            </div>

            <!-- Voting Form -->
            <div id="voteForm" data-visible="false">
                <div class="container no-margin">

                    <div class="votingInfo">
                        <div class="partiLogo">
                            <img src="assets/images/parti_logos/.png" alt="Parti logo">
                        </div>
                        <p class="partiName">&nbsp</p>
                    </div>

                    <div class="personalInfo">
                        <div class="selectFylker">
                            <p>Velg Fylke</p>
                            <asp:DropDownList ID="DropDownListFylker" runat="server" AutoPostBack="True" OnSelectedIndexChanged="GetFromKommuner">
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

        </div>
    </div>

    <div class="partier">
        <div class="partier__container">

            <div class="partier__item" tabindex="0" data-id="1">
                <div class="partier__logo">
                    <img src="assets/images/parti_logos/ap.png" alt="Parti logo">
                </div>
                <div class="partier__content">
                    <div class="partier__name">
                        <p>Arbeiderpartiet</p>
                        <hr>
                    </div>
                    <div class="partier__description">
                        <p>
                            Arbeiderpartiets visjon er en rettferdig verden uten fattigdom og i fred, der
                            menneskene er frie,
                            likestilte og har innflytelse på sine liv. Alle mennesker er unike, uerstattelige og
                            like mye verdt.
                            Hver av oss skal ha muligheten til å leve gode liv, i små og store fellesskap. Vi
                            vil ha et samfunn
                            basert på frihet, solidaritet og like muligheter for alle.
                            <span class="space"></span>
                            Vår ideologi, eller grunnsyn eller samfunnssyn om du vil, er sosialdemokrati. Vi
                            bygger vår politikk
                            på grunnverdiene frihet, likhet og solidaritet.
                        </p>
                    </div>
                    <div class="partier__vote">
                        <button class="voteBtn" tabindex="0" data-id="1">Stem på parti</button>
                    </div>
                </div>
            </div>

            <div class="partier__item" tabindex="0" data-id="2">
                <div class="partier__logo">
                    <img src="assets/images/parti_logos/h.png" alt="Parti logo">
                </div>
                <div class="partier__content">
                    <div class="partier__name">
                        <p>Høyre</p>
                        <hr>
                    </div>
                    <div class="partier__description">
                        <p>
                            Høyre vil bygge samfunnet på tillit til enkeltmennesket. Hver enkelt skal ha størst
                            mulig frihet til
                            og ansvar for å forme sitt eget liv og sin egen fremtid basert på respekt for andre
                            og for
                            fellesskapet.
                            <span class="space"></span>
                            Samfunnet består av mennesker med ulik kulturell bakgrunn. Høyre mener at mangfold
                            og forskjellighet
                            er en kilde til utveksling av ideer, fornyelse og kreativitet. Valgfrihet er en
                            naturlig del av å
                            kunne bestemme over eget liv.
                        </p>
                    </div>
                    <div class="partier__vote">
                        <button class="voteBtn" tabindex="0" data-id="2">Stem på parti</button>
                    </div>
                </div>
            </div>

            <div class="partier__item" tabindex="0" data-id="3">
                <div class="partier__logo">
                    <img src="assets/images/parti_logos/sp.png" alt="Parti logo">
                </div>
                <div class="partier__content">
                    <div class="partier__name">
                        <p>Senterpartiet</p>
                        <hr>
                    </div>
                    <div class="partier__description">
                        <p>
                            "Senterpartiet har som mål å legge vilkårene til rette for en harmonisk
                            samfunnsutvikling. Et levende
                            folkestyre, bygget på kristen og nasjonal grunn, er en forutsetning for folkets
                            trivsel og landets
                            fremgang.
                            <span class="space"></span>
                            Individet og menneskeverdet skal være det sentrale i samfunnet og vises tillit i
                            fellesskapet. De
                            sosiale, kulturelle og økonomiske tiltak fra samfunnets side må ta sikte på å skape
                            vekstvilkår og
                            trivsel for alle uansett bosted eller yrke."
                        </p>
                    </div>
                    <div class="partier__vote">
                        <button class="voteBtn" tabindex="0" data-id="3">Stem på parti</button>
                    </div>
                </div>
            </div>

            <div class="partier__item" tabindex="0" data-id="4">
                <div class="partier__logo">
                    <img src="assets/images/parti_logos/frp.png" alt="Parti logo">
                </div>
                <div class="partier__content">
                    <div class="partier__name">
                        <p>Fremskrittspartiet</p>
                        <hr>
                    </div>
                    <div class="partier__description">
                        <p>
                            Fremskrittspartiet er et liberalistisk folkeparti. Vi jobber for en strengere
                            innvandringspolitikk,
                            trygg eldreomsorg, gode sykehus, lavere skatter og avgifter og bedre veier. En
                            enklere hverdag for
                            folk flest.
                        </p>
                    </div>
                    <div class="partier__vote">
                        <button class="voteBtn" tabindex="0" data-id="4">Stem på parti</button>
                    </div>
                </div>
            </div>

            <div class="partier__item" tabindex="0" data-id="5">
                <div class="partier__logo">
                    <img src="assets/images/parti_logos/sv.png" alt="Parti logo">
                </div>
                <div class="partier__content">
                    <div class="partier__name">
                        <p>Sosialistisk Venstreparti</p>
                        <hr>
                    </div>
                    <div class="partier__description">
                        <p>
                            SV er partiet for deg som vil ha et samfunn med sterke fellesskap, små forskjeller,
                            og en offensiv
                            plan for en rettferdig løsning på klimakrisen.
                        </p>
                    </div>
                    <div class="partier__vote">
                        <button class="voteBtn" tabindex="0" data-id="5">Stem på parti</button>
                    </div>
                </div>
            </div>

            <div class="partier__item" tabindex="0" data-id="6">
                <div class="partier__logo">
                    <img src="assets/images/parti_logos/r.png" alt="Parti logo">
                </div>
                <div class="partier__content">
                    <div class="partier__name">
                        <p>Rødt</p>
                        <hr>
                    </div>
                    <div class="partier__description">
                        <p>
                            Økte forskjeller og privatisering truer alt det arbeiderbevegelsen har bygget opp i
                            Norge - trygghet,
                            velferd og et sterkt fellesskap. Det gjør at makt og muligheter blir urettferdig
                            fordelt. Folk
                            sorteres etter postnummer og bankkonto.
                            <span class="space"></span>
                            Samfunn bygget på samarbeid og likeverd er mer rettferdige enn samfunn basert på
                            kapitalistisk
                            konkurranse. Fordi fellesskap fungerer. Derfor er kampen mot forskjells-Norge Rødts
                            aller viktigste
                            sak.
                        </p>
                    </div>
                    <div class="partier__vote">
                        <button class="voteBtn" tabindex="0" data-id="6">Stem på parti</button>
                    </div>
                </div>
            </div>

            <div class="partier__item" tabindex="0" data-id="7">
                <div class="partier__logo">
                    <img src="assets/images/parti_logos/v.png" alt="Parti logo">
                </div>
                <div class="partier__content">
                    <div class="partier__name">
                        <p>Venstre</p>
                        <hr>
                    </div>
                    <div class="partier__description">
                        <p>
                            Venstre er et liberalt parti som ble stiftet i 1884. Venstre er det eldste partiet i
                            Norge og har
                            vært med på å forme det norske demokratiet. Venstre har som mål å skape et grønt,
                            rettferdig og
                            moderne samfunn der alle har like muligheter og frihet til å utvikle seg.
                        </p>
                    </div>
                    <div class="partier__vote">
                        <button class="voteBtn" tabindex="0" data-id="7">Stem på parti</button>
                    </div>
                </div>
            </div>

            <div class="partier__item" tabindex="0" data-id="8">
                <div class="partier__logo">
                    <img src="assets/images/parti_logos/mdg.png" alt="Parti logo">
                </div>
                <div class="partier__content">
                    <div class="partier__name">
                        <p>Miljøpartiet De Grønne</p>
                        <hr>
                    </div>
                    <div class="partier__description">
                        <p>
                            MDG er her for å stanse klima- og naturkrisa, med politikk som er bra for mennesker
                            og miljø.
                            <span class="space"></span>
                            Klima- og naturkrisen er den største urettferdigheten i vår tid. Kortsiktig
                            populisme, økende
                            forskjeller og miljøødeleggelser truer friheten og tryggheten mange av oss har tatt
                            for gitt.
                            Motgiften er grønn politikk - og grønne politikere, som forstår at en bedre verden
                            er mulig. Det
                            krever at vi våger å tenke nytt, lytter til fagkunnskap og samarbeider på tvers
                            av grenser.
                            <span class="space"></span>
                            I MDG har vi som utgangspunkt at mennesker ikke er hevet over naturen, men at vi er
                            en del av den.
                        </p>
                    </div>
                    <div class="partier__vote">
                        <button class="voteBtn" tabindex="0" data-id="8">Stem på parti</button>
                    </div>
                </div>
            </div>

            <div class="partier__item" tabindex="0" data-id="9">
                <div class="partier__logo">
                    <img src="assets/images/parti_logos/krf.png" alt="Parti logo">
                </div>
                <div class="partier__content">
                    <div class="partier__name">
                        <p>Kristelig Folkeparti</p>
                        <hr>
                    </div>
                    <div class="partier__description">
                        <p>
                            Kristelig Folkeparti har i hele sin historie hatt som hovedmål å verne om kristelige
                            og tradisjonelle
                            moralske verdier. Partiet har ikke noen utpreget klasseforankring, og har derfor
                            heller ikke noen
                            skarpt definert økonomisk eller sosial profil. Den borgerlige profilen ble styrket i
                            1980- og
                            1990-årene. Dette kom særlig klart til uttrykk da Kåre Kristiansen var partileder
                            noen år på 1970-
                            og 1980-tallet.
                        </p>
                    </div>
                    <div class="partier__vote">
                        <button class="voteBtn" tabindex="0" data-id="9">Stem på parti</button>
                    </div>
                </div>
            </div>

        </div>
    </div>

</asp:Content>
