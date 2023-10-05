<script setup lang="ts">

    const members = [
        {
            name: "Afaf Tarchoun",
            pic: "/images/teamMembers/atarchou.png"
        },
        {
            name: "Hamza Chakoubi",
            pic: "/images/teamMembers/hchakoub.png"
        },
        {
            name: "Amine El Rhair",
            pic: "/images/teamMembers/ael-rhai.png"
        },
    ]
    const techs = [
        {
            name: "JavaScript",
            pic: "/images/technologies/javascript.png"
        },
        {
            name: "TypeScript",
            pic: "/images/technologies/typescript.png"
        },
        {
            name: "Vuejs",
            pic: "/images/technologies/vuejs.png"
        },
        {
            name: "Docker",
            pic: "/images/technologies/docker.png"
        },
        {
            name: "Vuetify",
            pic: "/images/technologies/vuetify.png"
        },
        {
            name: "Postgres",
            pic: "/images/technologies/postgres.png"
        },
        {
            name: "Nginx",
            pic: "/images/technologies/nginx.png"
        },
        {
            name: "NestJS",
            pic: "/images/technologies/nestjs.png"
        },
        {
            name: "Prisma",
            pic: "/images/technologies/prisma.png"
        },
    ]

</script>

<template>
    <div class="about-container">
        <h2 class="header"> Our Team</h2>
        <section class="team">
            <div v-for="member in members" class="member">
                <div class="pic-container">
                    <img class="pic" :src="member.pic" alt="">
                </div>
                <h3 class="name"> {{ member.name }}</h3>
            </div>
        </section>
        <h2 class="header"> The project</h2>
        <section class="project">
            <p class="project-description">
                
                Ft_transcendence is an exciting project that reimagines the classic Pong game. With a focus on community and engagement,
                our platform offers players the chance to enjoy competitive Pong matches while connecting through real-time chat.
                Users can create or join various types of rooms, including private, public, or protected, to suit their gaming preferences.
                Each player has a unique profile showcasing their level, position on the leaderboards, and achievements.
            </p>
        </section>
        <h2 class="header"> Technologies</h2>
        <section class="technologies">
            <div v-for="tech in techs" class="tech">
                <div class="pic-container">
                    <img class="pic" :src="tech.pic" alt="">
                </div>
                <h3 class="name"> {{ tech.name }}</h3>
            </div>
        </section>
    </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Caveat&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Kalam&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Macondo&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Itim&display=swap');


.about-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    background-color: rgb(var(--v-theme-colorOne));
    padding: 2rem;
    padding-top: 2rem;
    color: white;
    font-family: 'Dancing Script', cursive;
    
    .header {
        width: 100%;
        text-align:center;
        font-size: 2.5rem;
        font-family: 'Kalam', cursive;
    }

    .team, .project {
        width: 70%;
        max-width: 800px;
        min-width: 400px;
        height: fit-content;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5rem;

        .member {
            min-width: 100px;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            .pic-container {
                height: 96px;
                width: 96px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                box-shadow: 0 0 5px 1px black;

                .pic {
                    height: 100px;
                    width: 100px;
                    border-radius: 50%;
                }
            }
            .name {
                text-align: center;
                font-size: 1.5rem;
            }
        }
        p {
            font-size: 1.5rem;
            font-family: 'Itim', cursive;
        }
    }

    .technologies {
        width: 90%;
        min-width: 400px;
        height: fit-content;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 2rem;

        .tech {
            display: flex;
            flex-direction: column;
            align-items: center;

            .pic {
                width: 70px;
                height: 70px;
                border-radius: 20%;
            }
        }
    }
}

</style>