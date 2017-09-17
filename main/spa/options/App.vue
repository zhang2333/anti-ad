<template>
    <div id="app" class="main">
        <h3 class="title">Hidings</h3>
        <div class="hiding-box">
            <div class="hiding-left">
                <div class="hiding-left">
                    <div class="hiding-title">
                        Match
                    </div>
                    <ul class="match-box">
                        <li class="match-item"
                            :class="{ active: current === i }"
                            v-for="(m, i) of matches"
                            :key="m.match"
                            @click="selectMatch(i)">
                            {{ m.match }}
                        </li>
                        <li class="match-item active" v-show="showNewMatch">
                            <input class="input-new" type="text"
                                v-model="newMatchText"
                                @blur="onNewMatchBlur"
                                ref="new">
                        </li>
                    </ul>
                    <div class="match-controls">
                        <span class="match-item match-control match-new"
                            @click="newMatch">
                            New
                        </span>
                        <span class="match-item match-control match-remove"
                            @click="removeMatch">
                            Remove
                        </span>
                    </div>
                </div>
            </div>
            <div class="hiding-right">
                <div class="hiding-title">
                    Selectors
                </div>
                <div class="input-wrapper">
                    <textarea class="input-sels" rows="20"
                        v-model="selectorsText"
                        @blur="onSelsTextBlur"
                        ref="sels"></textarea>
                </div>
            </div>
        </div>

        <div class="btn-save" @click="save">
            Save
        </div>

        <div class="msg-box">
        </div>
    </div>
</template>

<script>
export default {
    name: 'App',

    data () {
        return {
            current: -1,
            matches: [],
            selectorsText: '',
            newMatchText: '',
            showNewMatch: false
        }
    },

    computed: {
        selectors () {
            if (this.current > -1) {
                return this.matches[this.current].selectors
            }
            return []
        }
    },

    watch: {
        selectors () {
            this.selectorsText = this.selectors.join('\n')
        }
    },

    methods: {
        focus (el) {
            this.$nextTick(() => {
                el && el.focus()
            })
        },

        selectMatch (index) {
            if (this.current === index) return

            if (this.showNewMatch) {
                this.onNewMatchBlur()
            }

            this.onSelsTextBlur()

            this.current = index
            this.focus(this.$refs.sels)
        },

        newMatch () {
            this.current = -1
            this.showNewMatch = true
            this.focus(this.$refs.new)
        },

        removeMatch () {
            if (this.current < 0) return

            this.matches.splice(this.current, 1)
            this.current = -1
        },

        save () {
            if (this.matches.length > 0) {
                let config = {}
                console.log(this.matches)
                this.matches.forEach((m) => {
                    config[m.match] = { hideSels: m.selectors }
                })
                console.log('saved', config)
                chrome.storage.sync.set({ config }, () => {
                    alert('saved')
                })
            }
        },

        onNewMatchBlur () {
            let matches = this.matches.map(m => m.match)

            let text = this.newMatchText.trim()
            if (text && matches.indexOf(text) < 0) {
                this.matches.push({
                    match: text,
                    selectors: []
                })
            }

            this.newMatchText = ''
            this.showNewMatch = false
            this.current = this.matches.length - 1
        },

        onSelsTextBlur () {
            if (this.current > -1) {
                let sels = this.selectorsText.split('\n')
                    .map(s => s.trim())
                    .filter(s => !!s)
                this.matches[this.current].selectors = sels
            }
        }
    },

    mounted () {
        chrome.storage.sync.get('config', (data) => {
            data = data.config || {}
            console.log('got', data)
            this.matches = Object.keys(data).map((key) => {
                return { match: key, selectors: data[key].hideSels }
            })
        })
    }
}
</script>
