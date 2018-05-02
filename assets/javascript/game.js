// To do: Rename vars to be more consistent
// To do: Style pause and volume buttons for audio
// To do: bonfire responsive
// To do: consistent image sizes
// To do: arena styling, text
// To do: fix logo, shorten transparent logo

$(document).ready(function () {
    var mainChar = "";
    var opponent = "";
    var charRemaining = $("#character-selection").find(".character").length;
    console.log(charRemaining);

    function Character(name, hp, attack) {
        if (!(this instanceof Character)) { // scope-safe constructor in case called without new
            return new Character(name, hp, attack);
        }
        this.name = name;
        this.hp = hp;
        this.attack = attack;
        this.numOfAttacks = 1;
        this.audio = {
            lose: new Audio("assets/sounds/Dark Souls Death.mp3"),
            // win: new Audio("assets/sounds/Dark Souls Estus Flask.mp3")
            win: new Audio("assets/sounds/ds3va.mp3"),
            complete: new Audio("assets/sounds/vg.mp3")
        };
        this.getAtkPwr = function () {
            return this.numOfAttacks * attack;
        }
    }

    // banner class
    function Banner(banner) {

    }

    // set name and hp text on characters from data attributes
    $("#character-selection").find(".character").each(function () {
        console.log($(this).data("name"));
        var hpText = "<div class='hp green-text'>" + $(this).data("hp") + " hp</div>"
        $(this).find("figcaption").prepend($(this).data("name") + hpText);
    });

    // find shorter length
    var fightMusic = $("#fight-music");
    fightMusic[0].volume = 0.2;
    // fightMusic.play();
    var char7 = $("#char7");

    // refresh page when bonfire clicked
    $("#bonfire").on("click", function () {
        document.location.reload();
    });

    // store original height of figcaption in global var as workaround
    var captionHeight = $(".character").find("figcaption").outerHeight();
    $(".character").find("figure").hover(
        function () {
            var $this = $(this);
            // store original height of figcaption in $ function for mouseleave function
            // not working as intended yet on animate, css() no problem
            $.data(this, 'cHeight', $this.find("figcaption").outerHeight());
            $(this).find("figcaption").stop(true, false).css({
                "line-height": "1.5em",
                height: '100%'
            });
            $(this).find(".flavour-text").show();
        },
        function () {
            $(this).find("figcaption").stop(true, false).css({
                height: $.data(this, 'cHeight')
                // height: captionHeight
            });
            $(this).find(".flavour-text").hide();
        }
    );

    // handles attacker and opponent selection
    $("#character-selection").on("click", ".character", function () {
        if (mainChar && !opponent) {
            charRemaining--;
            opponent = new Character($(this).data("name"), $(this).data("hp"), $(this).data("attack"));
            $(this).find("figure").css({ "border-color": "#bd0000" });
            $(this).addClass("defender");
            $(this).hide();
            $(".arena").append(this);
            $(this).show("normal");
            $("#character-selection").slideUp(1000);
            // $("#select").fadeOut(1);
            // $("#select").text("Select an opponent").stop(true, false).fadeIn(1000);
        } else if (!mainChar) {
            charRemaining--;
            mainChar = new Character($(this).data("name"), $(this).data("hp"), $(this).data("attack"));
            $(this).find("figure").css({ "border-color": "#028202" });
            $(this).addClass("attacker");
            // $(this).append("<button id='attack-button'>Attack</button>");
            $(this).hide();
            $(".arena").append(this);
            $(this).show("normal");
            $("#select").fadeOut(1);
            $("#select").text("Select an opponent").stop(true, true).fadeIn(1000);
        }
    });

    // delegate parent to find created button rather than button itself cause can't target created elements directly
    $("#board").on("click", "#attack-button", function () {
        if (opponent && mainChar.hp > 0) {
            $("#atkText").html("You attacked " + opponent.name + " for <span class='green-text'>" + mainChar.getAtkPwr() + "</span> damage.");
            $("#cntrAtkText").html(opponent.name + " attacked you for <span class='red-text'>" + opponent.getAtkPwr() + "</span> damage.");
            fight();
        } else if (mainChar.hp <= 0) {
            $("#atkText").text("You are dead.");
        } else {
            $("#atkText").text("No opponent found.");
        }
        updateBoard();
    });

    // handle attacker and defender attacks and hp deductions
    function fight() {
        mainChar.hp -= opponent.getAtkPwr();
        opponent.hp -= mainChar.getAtkPwr();
        mainChar.numOfAttacks++;
        if (mainChar.hp <= 0) { // you died
            mainChar.hp = 0;
            fightMusic.animate({ volume: 0 }, 1000);
            mainChar.audio.lose.play();
            // mainChar.audio.lose.currentTime = 0;
            $("#died").css({ display: "block" });
            $("#died").animate({
                opacity: 1,
                "font-size": "5em"
            }, 2000);
        }
        if (opponent.hp <= 0) { // killed opponent
            opponent.hp = 0;
            mainChar.audio.win.play();
            mainChar.audio.win.currentTime = 0;
            $("#victory").text(opponent.name + " has fallen");
            $("#victory").css({ display: "block" });
            $("#victory").animate({
                opacity: 1
            }, 1500,
                function () {
                    $("#victory").stop(true, false).animate({
                        opacity: 0
                    }, 1500, function () {
                        $("#victory").css({ display: "none" });
                    });
                });
            opponent = "";
            $(".defender").remove();
            if (charRemaining > 0) {
                $("#character-selection").slideDown(1000);
            } else {
                $("#victory").text("Victory Achieved");
                $("#victory").css({ display: "block" });
                $("#victory").animate({
                    opacity: 1
                }, 1500);
            }
        }
    }

    // update hp text
    function updateBoard() {
        if (mainChar.hp / $(".attacker").data("hp") <= 0.5) {
            $(".attacker").find(".hp").css({ color: "#ff0000" });
        }
        if (opponent.hp / $(".defender").data("hp") <= 0.5) {
            $(".defender").find(".hp").css({ color: "#ff0000" });
        }
        $(".attacker").find(".hp").text(mainChar.hp + " hp");
        $(".defender").find(".hp").text(opponent.hp + " hp");
    }

    $("#vol-control").on("click", function () {
        var muted = fightMusic.prop("muted");
        $(this).toggleClass("fa-volume-up fa-volume-off");
        fightMusic.prop("muted", !muted);
    });
});

