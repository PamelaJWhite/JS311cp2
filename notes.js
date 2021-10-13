let story = {
    title: "The three bears" [
        {
            firstSection: "You see a door" [
                {
                    option1: "knock",
                    end_section: false,
                    resulting_section: "a bear answers" [
                        {
                            option1: "say hi",
                            end_section: true,
                            resulting_section: "the bear eats you."
                        },
                        {
                            option2: "run away",
                            end_section: false,
                            resulting_section : "he chases you" [
                                {
                                    option1: "give up",
                                    end_section:true,
                                    resulting_section: "the bear eats you"
                                },
                                {
                                    option2: "keep running",
                                    end_section: true,
                                    resulting_section: "you make it home and slam the door. the end."
                                }
                            ]
                        }
                         
                    ]
                },
                {
                    option2: "run away",
                    end_section: false,
                    resulting_section : "he chases you" [
                        {
                            option1: "give up",
                            end_section:true,
                            resulting_section: "the bear eats you"
                        },
                        {
                            option2: "keep running",
                            end_section: true,
                            resulting_section: "you make it home and slam the door. the end."
                        }
                    ]
                }
            ]
        }
    ]
}