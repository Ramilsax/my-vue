<template>
    <v-container fluid  grid-list-xl>
        <v-layout row>
            <v-flex xs12>
                <h1>Справочники</h1>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs4>
                <v-card>
                    <v-list>
                        <v-list-tile >
                            <v-list-tile-title class="title">
                                Управление персоналом
                            </v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                    <v-divider></v-divider>

                    <v-list dense class="pt-0">
                        <v-list-tile
                                v-for="item in links" :key="item.title" :to="item.url">
                            <v-list-tile-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-tile-action>

                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.title }} {{ item.count }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-flex>
             <v-flex xs4>
                 <v-card>
                     <v-list>
                         <v-list-tile >
                            <v-list-tile-title class="title">
                                Прочее
                                 </v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                    <v-divider></v-divider>
                    <v-list dense class="pt-0">
                        <v-list-tile
                                v-for="item in links1" :key="item.title" :to="item.url"> 
                            <v-list-tile-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.title }} {{ item.count }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
            </v-card>
      </v-flex>
       <v-flex xs4>
                 <v-card>
                     <v-list>
                         <v-list-tile >
                            <v-list-tile-title class="title">
                                Производство
                                 </v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                    <v-divider></v-divider>
                    <v-list dense class="pt-0">
                        <v-list-tile
                                v-for="item in links2" :key="item.title" :to="item.url"> 
                            <v-list-tile-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.title }} {{ item.count }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
            </v-card>
      </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "Directory",
        computed: {
            //Ссылки
            links() {
                return this.$store.getters.directoryLinks;
            },
            links1() {
                return this.$store.getters.directoryLinks1;
            },
            links2() {
                return this.$store.getters.directoryLinks2;
        },
            count() {
            return this.$store.getters.getProfessionsCount.length;
            }
    }
}
</script>

<style scoped>

</style>
