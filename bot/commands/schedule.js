module.exports = {
    name: 'schedule',
    description: 'returns the current games schedule',
    execute(message, args) {
        const puppeteer = require('puppeteer');

        (async () => {
    
            const browser = await puppeteer.launch({headless : true});
            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(0);
            await page.goto("https://www.iihf.com/en/events/2022/wmiv/schedule");
            const url = await page.url();
            const title = await page.title();

            const grabGames = await page.evaluate(() => {
    
                const games = document.querySelectorAll(".b-card-schedule.s-card-container.visible");
    
                let gamesArr = [];
                games.forEach((gamesTag) => {
                    const date = gamesTag.querySelector(".s-date").getAttribute("data-time");
                    const arena = gamesTag.querySelector(".s-arena");
                    const homeTeam = gamesTag.getAttribute("data-hometeam");
                    const guestTeam = gamesTag.getAttribute("data-guestteam");
                    const isUpcoming = gamesTag.getAttribute("data-gameisupcoming");
                    const isLive = gamesTag.getAttribute("data-gameislive");
                    
                    if ((isUpcoming == "False") && (isLive == "False"))
                    {
                        const homeTeamScore = gamesTag.querySelector(".s-count.js-homescore");
                        const guestTeamScore = gamesTag.querySelector(".s-count.js-awayscore");
                        const winningTeam = gamesTag.querySelector(".s-countries__item.s-countries__item--winner");
    
                        // Past Matches
                        gamesArr.push({
                            Match_State: "Final",
                            Date_and_Time: date,
                            Arena: arena.innerText,
                            Home_Team: homeTeam,
                            Guest_Team: guestTeam,
                            Home_Team_Score: homeTeamScore.innerText,
                            Guest_Team_Score: guestTeamScore.innerText,
                            Winning_Team: winningTeam.innerText,
                        });
                    }
    
                    else if ((isUpcoming == "False") && (isLive == "True"))
                    {
                        const homeTeamScore = gamesTag.querySelector(".s-count.js-homescore");
                        const guestTeamScore = gamesTag.querySelector(".s-count.js-awayscore");
                        const winningTeam = "Not yet declared";
    
                        // Live Matches
                        gamesArr.push({
                            Match_State: "Live",
                            Date_and_Time: date,
                            Arena: arena.innerText,
                            Home_Country: homeTeam,
                            Guest_Country: guestTeam,
                            Winning_Team: winningTeam,
                        });
                    }
    
                    else
                    {   
                        // Upcoming Matches
                        gamesArr.push({
                            Match_State: "Upcoming",
                            Date_and_Time: date,
                            Arena: arena.innerText,
                            Home_Country: homeTeam,
                            Guest_Country: guestTeam,
                        });
                    }
                });
                 
                return gamesArr;
            });

            message.channel.send("Your games schedule: ");
            for (i = 0; i < grabGames.length; i++)
            {
                message.channel.send(require('util').inspect(grabGames[i]));
            }

            console.log(grabGames)
            await browser.close();

        })();

    } // End of Execute Message
  } // End of module.exports
