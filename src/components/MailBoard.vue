

<template>
  <b-container fluid class="px-auto">
    <b-row class="mx-0 my-3" align-h="between" align-v="center">

      <b-col cols="auto" class="m-0 p-0">
        <b-form-group class="mb-0">
          <b-input-group size="sm">
              <v-date-picker 
              mode="range"
              v-model="datePicker.range"
              :attributes='datePicker.attrs'
              :available-dates='{
                start: new Date(2018, 0, 1),
                end: new Date()
              }'
              :inputProps="inputProps"
              >
              <input
              size="md"
              class="w-full shadow appearance-none border rounded-left py-2 px-3 text-gray-700 hover:border-gray-5 text-right border-right-0 border-secondary outline-zero"
                id="date"
                slot-scope="{ inputProps, inputEvents }"
                :style="{backgroundImage: `url(${images.calenderIcon})`, backgroundPosition: '10px 10px', backgroundRepeat: 'no-repeat', backgroundSize: '19px'}"
                v-bind="inputProps"
                v-on="inputEvents">
            </v-date-picker>
            <b-input-group-append>
              <b-button class="w-100 shadow border-secondary border-right rounded-right"
              variant="light"
              @click="search()"><span aria-hidden="true" class="mx-2 d-block icon-size" :style="{backgroundImage: `url(${images.searchIcon})`}"></span></b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col cols="auto" class="m-0 p-0">
        <b-form-group class="m-0 p-0 mt-lg-0 mt-2">
          <b-input-group size="sm">
          <b-input-group-append>
            <b-button squared class="w-100 shadow border-secondary border-right rounded-right" variant="light" @click="changeTheme('light')">
              Light
            </b-button>
            <b-button squared class="w-100 shadow border-secondary border-right rounded-left" variant="dark" @click="changeTheme('dark')">
              Dark
            </b-button>
          </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      
    </b-row>

    <b-row class="mx-0 font-weight-bold">
      <p>Results: {{ items.length }} mail(s)</p>
    </b-row>

    <b-row v-if="!items.length" class="mx-0 mb-2">
      <hr class="w-100 m-0 mb-5">
      <img :src="images.logo" class="mt-5 mx-auto d-block" alt="logo">
    </b-row>

    <b-row v-else class="mx-0 mb-2">
      <b-table
        ref="table"
        :small="table.small"
        :hover="table.hover"
        :table-variant="table.variant"
        :head-variant="table.headVariant"
        :thead-class="table.theadClass"
        :items="items"
        :fields="table.fields"
        :current-page="table.currentPage"
        :per-page="table.perPage"
        :filter="table.filter"
        :filterIncludedFields="table.filterOn"
        :sort-by.sync="table.sortBy"
        :sort-desc.sync="table.sortDesc"
        :sort-direction="table.sortDirection"
        :selectable="table.selectable"
        :select-mode="table.selectMode"
        :tbody-tr-class="rowClass"
        :busy="table.isBusy"
        @row-clicked="onRowClicked"
        @filtered="onFiltered"
        :stacked="table.stacked"
        :responsive="table.responsive">
        <template v-slot:cell(from)="data">
          <b-link v-bind:class="computedTextClass" class="no-underline" :href="`mailto:${data.value}`">{{ data.value }}</b-link>
        </template>
        <template v-slot:cell(to)="data">
          <b-link v-if="!check(data.value)" v-bind:class="computedTextClass" class="no-underline" :href="`mailto:${data.value}`">{{ data.value }}</b-link>
          <b-link v-else v-for="(item, index) in data.value" :key="index" v-bind:class="computedTextClass" class="no-underline" :href="`mailto:${item}`">{{ item }}<span v-if="(index !== (data.value.length - 1))">, </span></b-link>
        </template>
        <template v-slot:cell(subject)="data">
          <span v-bind:class="computedTextClass">{{ data.value }}</span><b-img v-if="!data.item.attachment" :src="images.clipIcon" class="icon-size" fluid alt="attachment" right></b-img>
        </template>
        <template v-slot:cell(date)="data">
          <span v-bind:class="computedTextClass">{{ data.value }}</span>
        </template>
        <template v-slot:row-details="row">
          <b-row v-bind:class="computedTextClass" class="mb-2 text-justify">
            <b-col>{{ row.item.body }}</b-col>
          </b-row>
        </template>
        <template v-slot:table-busy>
          <b-row class="mx-0 mb-2">
            <hr class="w-100 m-0 mb-5">
            <img :src="images.logo" class="mt-5 mx-auto d-block rotate-image rounded-circle" alt="logo">
          </b-row>
        </template>
      </b-table>
    </b-row>

  </b-container>
</template>

<script>
import cIcon from '@/assets/icon_calender.svg';
import cSearch from '@/assets/icon_search.svg';
import cClip from '@/assets/icon_clip.svg';
import mailArchiverLogo from '@/assets/logo.png';

export default {
  name: 'MailBoard',
  props: {
    msg: String
  },
  data() {
      return {
        empty: [],
        items: [
          { from: 'aaa@example.com', to: 'zzz.zzz@example.com', subject: '[ HR-888 ] Notice of official announcement', date: '1586320356', attachment: false,
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'+ 
          'Interdum posuere lorem ipsum dolor sit amet consectetur. Diam vulputate ut pharetra sit. Non sodales neque sodales ut etiam. Id leo in vitae turpis massa sed elementum.'+
          'Id donec ultrices tincidunt arcu non sodales neque sodales ut. Vitae congue eu consequat ac felis. Interdum velit euismod in pellentesque massa placerat duis ultricies. '+
          'Venenatis cras sed felis eget. Neque egestas congue quisque egestas diam in. Id eu nisl nunc mi ipsum faucibus vitae aliquet nec. Dictumst vestibulum rhoncus est pellentesque'+
          'elit ullamcorper. Risus nec feugiat in fermentum posuere urna nec tincidunt praesent. Purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae.'+
          ' Enim nunc faucibus a pellentesque sit amet porttitor eget.'
          },
          { from: 'bbb.bbbb@example.com', to: 'yyy@example.com', subject: '[web:333] "Web Contact"', date: '1586320356', attachment: false,
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'+ 
          'Interdum posuere lorem ipsum dolor sit amet consectetur. Diam vulputate ut pharetra sit. Non sodales neque sodales ut etiam. Id leo in vitae turpis massa sed elementum.'+
          'Id donec ultrices tincidunt arcu non sodales neque sodales ut. Vitae congue eu consequat ac felis. Interdum velit euismod in pellentesque massa placerat duis ultricies. '+
          'Venenatis cras sed felis eget. Neque egestas congue quisque egestas diam in. Id eu nisl nunc mi ipsum faucibus vitae aliquet nec. Dictumst vestibulum rhoncus est pellentesque'+
          'elit ullamcorper. Risus nec feugiat in fermentum posuere urna nec tincidunt praesent. Purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae.'+
          ' Enim nunc faucibus a pellentesque sit amet porttitor eget.'
          },
          {
            from: 'ccc@example.com',
            to: ['xxx@example.com', 'aaa@example.com'],
            subject: 'Happy New Year! Greetings for the New Year.', date: '1586320356', attachment: true,
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'+ 
          'Interdum posuere lorem ipsum dolor sit amet consectetur. Diam vulputate ut pharetra sit. Non sodales neque sodales ut etiam. Id leo in vitae turpis massa sed elementum.'+
          'Id donec ultrices tincidunt arcu non sodales neque sodales ut. Vitae congue eu consequat ac felis. Interdum velit euismod in pellentesque massa placerat duis ultricies. '+
          'Venenatis cras sed felis eget. Neque egestas congue quisque egestas diam in. Id eu nisl nunc mi ipsum faucibus vitae aliquet nec. Dictumst vestibulum rhoncus est pellentesque'+
          'elit ullamcorper. Risus nec feugiat in fermentum posuere urna nec tincidunt praesent. Purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae.'+
          ' Enim nunc faucibus a pellentesque sit amet porttitor eget.'
          },
          {
            from: 'ddd.dddd@example.com',
            to: ['vvv.vvv@example.com', 'jjj.jjj@example.com'],
            subject: '[HR-887(Revised: Office Expansion Project Team)] Notice of off...', date: '1586320356', attachment: false,
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'+ 
          'Interdum posuere lorem ipsum dolor sit amet consectetur. Diam vulputate ut pharetra sit. Non sodales neque sodales ut etiam. Id leo in vitae turpis massa sed elementum.'+
          'Id donec ultrices tincidunt arcu non sodales neque sodales ut. Vitae congue eu consequat ac felis. Interdum velit euismod in pellentesque massa placerat duis ultricies. '+
          'Venenatis cras sed felis eget. Neque egestas congue quisque egestas diam in. Id eu nisl nunc mi ipsum faucibus vitae aliquet nec. Dictumst vestibulum rhoncus est pellentesque'+
          'elit ullamcorper. Risus nec feugiat in fermentum posuere urna nec tincidunt praesent. Purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae.'+
          ' Enim nunc faucibus a pellentesque sit amet porttitor eget.'
          },
          { from: 'eee@example.com', to: ['sss@example.com', 'nmn@example.com', 'mnm@example.com'], subject: '[Github] Logout page', date: '1586320356', attachment: false,
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'+ 
          'Interdum posuere lorem ipsum dolor sit amet consectetur. Diam vulputate ut pharetra sit. Non sodales neque sodales ut etiam. Id leo in vitae turpis massa sed elementum.'+
          'Id donec ultrices tincidunt arcu non sodales neque sodales ut. Vitae congue eu consequat ac felis. Interdum velit euismod in pellentesque massa placerat duis ultricies. '+
          'Venenatis cras sed felis eget. Neque egestas congue quisque egestas diam in. Id eu nisl nunc mi ipsum faucibus vitae aliquet nec. Dictumst vestibulum rhoncus est pellentesque'+
          'elit ullamcorper. Risus nec feugiat in fermentum posuere urna nec tincidunt praesent. Purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae.'+
          ' Enim nunc faucibus a pellentesque sit amet porttitor eget.' },
          { from: 'fff.ffff@example.com', to: 'qqq.qqq@example.com', subject: '［dev］ Postfix 3.1.12 / 3.2.9 / 3.3.4 / 3.4.5', date: '1586320356', attachment: false,
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'+ 
          'Interdum posuere lorem ipsum dolor sit amet consectetur. Diam vulputate ut pharetra sit. Non sodales neque sodales ut etiam. Id leo in vitae turpis massa sed elementum.'+
          'Id donec ultrices tincidunt arcu non sodales neque sodales ut. Vitae congue eu consequat ac felis. Interdum velit euismod in pellentesque massa placerat duis ultricies. '+
          'Venenatis cras sed felis eget. Neque egestas congue quisque egestas diam in. Id eu nisl nunc mi ipsum faucibus vitae aliquet nec. Dictumst vestibulum rhoncus est pellentesque'+
          'elit ullamcorper. Risus nec feugiat in fermentum posuere urna nec tincidunt praesent. Purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae.'+
          ' Enim nunc faucibus a pellentesque sit amet porttitor eget.' },
          { from: 'ggg@example.com', to: 'ppp@example.com', subject: 'Re: [Github] Brush-up on loading animation ', date: '1586320356', attachment: false,
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'+ 
          'Interdum posuere lorem ipsum dolor sit amet consectetur. Diam vulputate ut pharetra sit. Non sodales neque sodales ut etiam. Id leo in vitae turpis massa sed elementum.'+
          'Id donec ultrices tincidunt arcu non sodales neque sodales ut. Vitae congue eu consequat ac felis. Interdum velit euismod in pellentesque massa placerat duis ultricies. '+
          'Venenatis cras sed felis eget. Neque egestas congue quisque egestas diam in. Id eu nisl nunc mi ipsum faucibus vitae aliquet nec. Dictumst vestibulum rhoncus est pellentesque'+
          'elit ullamcorper. Risus nec feugiat in fermentum posuere urna nec tincidunt praesent. Purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae.'+
          ' Enim nunc faucibus a pellentesque sit amet porttitor eget.' },
          { from: 'hhh.hhh@example.com', to: 'ooo.ooo@example.com', subject: 'Workplace Summary for sample, Inc.: Jun 2 - Jun 9', date: '1586320356', attachment: true,
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'+ 
          'Interdum posuere lorem ipsum dolor sit amet consectetur. Diam vulputate ut pharetra sit. Non sodales neque sodales ut etiam. Id leo in vitae turpis massa sed elementum.'+
          'Id donec ultrices tincidunt arcu non sodales neque sodales ut. Vitae congue eu consequat ac felis. Interdum velit euismod in pellentesque massa placerat duis ultricies. '+
          'Venenatis cras sed felis eget. Neque egestas congue quisque egestas diam in. Id eu nisl nunc mi ipsum faucibus vitae aliquet nec. Dictumst vestibulum rhoncus est pellentesque'+
          'elit ullamcorper. Risus nec feugiat in fermentum posuere urna nec tincidunt praesent. Purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae.'+
          ' Enim nunc faucibus a pellentesque sit amet porttitor eget.' },
          { from: 'iii@example.com', to: 'nnn@example.com', subject: 'I love you', date: '1586320356', attachment: true,
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'+ 
          'Interdum posuere lorem ipsum dolor sit amet consectetur. Diam vulputate ut pharetra sit. Non sodales neque sodales ut etiam. Id leo in vitae turpis massa sed elementum.'+
          'Id donec ultrices tincidunt arcu non sodales neque sodales ut. Vitae congue eu consequat ac felis. Interdum velit euismod in pellentesque massa placerat duis ultricies. '+
          'Venenatis cras sed felis eget. Neque egestas congue quisque egestas diam in. Id eu nisl nunc mi ipsum faucibus vitae aliquet nec. Dictumst vestibulum rhoncus est pellentesque'+
          'elit ullamcorper. Risus nec feugiat in fermentum posuere urna nec tincidunt praesent. Purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae.'+
          ' Enim nunc faucibus a pellentesque sit amet porttitor eget.' },
          { from: 'Pablo-Diego-Jose-Francisco@example.com', to: 'Pablo-Diego-Jose-Francisco@example.com', subject: '[info:888] ABC EQUIPMENT COMPANY', date: '1586320356', attachment: false,
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'+ 
          'Interdum posuere lorem ipsum dolor sit amet consectetur. Diam vulputate ut pharetra sit. Non sodales neque sodales ut etiam. Id leo in vitae turpis massa sed elementum.'+
          'Id donec ultrices tincidunt arcu non sodales neque sodales ut. Vitae congue eu consequat ac felis. Interdum velit euismod in pellentesque massa placerat duis ultricies. '+
          'Venenatis cras sed felis eget. Neque egestas congue quisque egestas diam in. Id eu nisl nunc mi ipsum faucibus vitae aliquet nec. Dictumst vestibulum rhoncus est pellentesque'+
          'elit ullamcorper. Risus nec feugiat in fermentum posuere urna nec tincidunt praesent. Purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae.'+
          ' Enim nunc faucibus a pellentesque sit amet porttitor eget.' },
        ],
        
        inputProps: {
          placeholder: ""
        },

        images: {
          calenderIcon: cIcon,
          searchIcon: cSearch,
          logo: mailArchiverLogo,
          clipIcon: cClip
        },

        datePicker: {
          attrs: [
            {
              key: 'today',
              dot: true,
              dates: new Date(),
            },
          ],
          range: {
            start: new Date(),
            end: new Date()
          },
        },

        table: {
          fields: [
            { key: 'from', label: 'From', sortable: true, sortDirection: 'desc' },
            { key: 'to', label: 'To', sortable: true, class: 'text-center'},
            {
              key: 'subject',
              label: 'Subject',
              sortable: true,
              sortByFormatted: true,
              filterByFormatted: true
            },
            { key: 'date', label: 'Date', 
              formatter: (value, key, item) => {
                return new Date().getFullYear()
              } 
            }
          ],
          currentPage: 1,
          perPage: 10,
          filter: null,
          filterOn: [],
          sortBy: '',
          sortDesc: false,
          sortDirection: 'asc',
          selectMode: 'multi',
          selected: [],
          totalRows: 1,
          pagetotalRowsOptions: [5, 10, 15],
          headerClass: 'header',
          variant: 'light',
          headVariant: 'light',
          small: true,
          hover: true,
          selectable: true,
          stacked: 'md',
          responsive: 'md',
          theadClass: 'bg-light text-secondary',
          isBusy: false,
        },

        infoModal: {
          id: 'info-modal',
          title: '',
          content: ''
        },
      }
    },
    computed: {
      sortOptions() {
        return this.table.fields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
      },
      computedTextClass() {
        let textClass;
        if (this.selectedTheme() == 'light') {
          textClass = 'text-secondary';
        } else {
          textClass = 'text-light';
        }
        return textClass;
      }
    },
    mounted() {
      this.table.totalRows = this.items.length
    },
    methods: {
      info(item, index, button) {
        this.infoModal.title = `Row index: ${index}`
        this.infoModal.content = JSON.stringify(item, null, 2)
        this.$root.$emit('bv::show::modal', this.infoModal.id, button)
      },
      resetInfoModal() {
        this.infoModal.title = ''
        this.infoModal.content = ''
      },
      onFiltered(filteredItems) {
        this.table.totalRows = filteredItems.length
        this.table.currentPage = 1
      },
      onRowClicked(item, index, event) {
        item._showDetails = !item._showDetails;
      },
      rowClass(item, type) {
        if (!item || type !== 'row') return
        if (this.table.variant == 'light') {
          return 'text-secondary'
        } else {
          return 'text-light'
        }
      },
      check(item) {
        return Array.isArray(item);
      },
      log(item){
        console.log(item);
      },
      search(){
        console.log("search");
      },
      changeTheme(value) {
        this.table.variant = value;
        this.table.headVariant = value;
      },
      selectedTheme() {
        if (this.table.variant == 'light') {
          return 'light';
        } else {
          return 'dark';
        }
      }
    }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.w-80 {
    width: 80% !important;
}
.w-20 {
    width: 20% !important;
}
.header {
    background-color: rgb(199, 189, 189) !important;
}
.outline-zero {
  outline: 0;
}
.no-underline {
  text-decoration: none;
}
.icon-size {
  width: 16px;
  height: 16px;
  background-repeat: no-repeat;
}
.rotate-image {
    position: relative;
    -webkit-animation:spin 6s linear infinite;
    -moz-animation:spin 6s linear infinite;
    animation:spin 6s linear infinite;
}
@-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
@-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
</style>
