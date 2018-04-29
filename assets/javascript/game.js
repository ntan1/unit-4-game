$(document).ready(function () {
    var aragorn = new Character("Aragorn", 100, 6);
    var boromir = new Character("Boromir", 120, 4);
    var gimli = new Character("Gimli", 150, 8);
    var witch_king = new Character("Witch King", 150, 10);

    function Character(name, hp, attack) {
        if (!(this instanceof Character)) { // scope-safe constructor in case called without new
            return new Character(name, hp, attack);
        }
        this.name = name;
        this.hp = hp;
        this.attack = attack;
        this.numOfAttacks = 1;
        this.audio = {
            lose: new Audio("assets/sounds/Dark Souls Death.mp3")
        };
        this.getAtkPwr = function () {
            return this.numOfAttacks * attack;
        }
    }


    var char7 = $("#char7");

    // store original height of figcaption in global var as workaround
    var captionHeight = $(".character").find("figcaption").outerHeight();
    $(".character").find("figure").hover(
        function () {
            var $this = $(this);
            // store original height of figcaption in $ function for mouseleave function
            // not working as intended yet on animate, css() no problem
            $.data(this, 'cHeight', $this.find("figcaption").outerHeight());
            $(this).find("figcaption").stop(true, false).css({
                height: '100%'
            });
        },
        function () {
            $(this).find("figcaption").stop(true, false).css({
                height: $.data(this, 'cHeight')
                // height: captionHeight
            });
        }
    );

    var mainChar = "";
    var opponent = "";
    $("#character-selection").on("click", ".character", function () {
        if (mainChar && !opponent) {
            opponent = new Character($(this).data("name"), $(this).data("hp"), $(this).data("attack"));
            $(this).addClass("defender");
            $(".arena").append(this);
            $("#select").fadeOut(1);
            $("#select").text("Select an opponent").stop(true, false).fadeIn(1000);
            console.log("Your opponent is " + opponent.name);
        } else if (!mainChar) {
            mainChar = new Character($(this).data("name"), $(this).data("hp"), $(this).data("attack"));
            $(this).addClass("attacker");
            $(this).append("<button id='attack-button'>Attack</button>");
            $(".arena").append(this);
            $("#select").fadeOut(1);
            $("#select").text("Select an opponent").stop(true, true).fadeIn(1000);
            console.log("You chose " + mainChar.name);
        }
    });

    // delegate click event to parent of created button rather than button itself
    $("#board").on("click", "#attack-button", function () {
        $("#atkText").text("You attacked " + opponent.name + " for " + mainChar.getAtkPwr() + " damage");
        $("#cntrAtkText").text(opponent.name + " attacked you for " + opponent.getAtkPwr() + " damage");
        fight();
        updateBoard();
        mainChar.numOfAttacks++;
    });

    function fight() {
        mainChar.hp -= opponent.getAtkPwr();
        opponent.hp -= mainChar.getAtkPwr();
        if (mainChar.hp <= 0) {
            console.log("you lose");
            mainChar.audio.lose.play();
            // mainChar.audio.lose.currentTime = 0;
        }
        if (opponent.hp <= 0) {
            console.log(opponent.name + " has been defeated");
            opponent = "";
            $(".defender").remove();
        }
    }

    function updateBoard() {
        $(".attacker").find(".hp").text(mainChar.hp);
        $(".defender").find(".hp").text(opponent.hp);
    }

});

