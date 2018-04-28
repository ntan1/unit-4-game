$(document).ready(function () {
    var aragorn = new Character("Aragorn", 100, 6);
    var boromir = new Character("Boromir", 120, 4);
    var gimli = new Character("Gimli", 150, 8);
    var witch_king = new Character("Witch King", 150, 10);

    function Character(name, hp, attack) {
        if (!(this instanceof Character)) { // scope-safe constructor in case called without new
            return new Character(name, hp, attack);
        }
        this.name = name,
            this.hp = hp,
            this.attack = attack,
            this.defenderArea = false
    }


    var char7 = $("#char7");
    var attkBtn = $("#attack-btn");
    attkBtn.on("click", function () {
        char7.attr("class", "character-portrait col-6");
    });

    // store original height of figcaption in global var as workaround
    var captionHeight = $(".character-portrait").find("figcaption").outerHeight();
    $(".character-portrait").hover(
        function () {
            // var $this = $(this);
            // store original height of figcaption in $ function for mouseleave function
            // not working as intended yet
            // $.data(this, 'cHeight', $this.find("figcaption").outerHeight());
            $(this).find("figcaption").stop(true, false).animate({
                height: '100%'
            });
        },
        function () {
            $(this).find("figcaption").stop(true, false).animate({
                // height: $.data(this, 'cHeight')
                height: captionHeight
            });
        }
    );

    $(".character-portrait").on("click", function() {
        $(".arena").append(this);
    });
});

