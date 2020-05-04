

<template>
  <b-container fluid class="px-auto">
    <b-row class="mx-0 my-3" align-h="between" align-v="center">

      <b-col cols="auto" class="m-0 p-0">
        <b-form-group class="mb-0">
          <b-input-group size="sm">
              <v-date-picker 
              mode="range"
              v-model="computedRange"
              :attributes='datePicker.attrs'
              :available-dates='datePicker.available'
              :select-attribute="selectDragAttribute"
              :drag-attribute="selectDragAttribute"
              @drag="datePicker.dragValue = $event"
              >
              <div slot="day-popover" slot-scope="{ format }">
                {{ format(datePicker.dragValue ? datePicker.dragValue.start : datePicker.range.start, 'MMM D') }}
                -
                {{ format(datePicker.dragValue ? datePicker.dragValue.end : datePicker.range.end, 'MMM D') }}
              </div>
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
        <b-form-group class="m-0 p-0 mb-lg-2 mt-lg-0 mt-2">
          <b-input-group size="sm">
            <b-input-group-append>
              <b-button squared class="w-100 shadow border-secondary border-right rounded-right" variant="info" @click="getAllMails('light')">
                Get All Mails
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
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
      <p>Results: {{ tableLength }} mail(s)</p>
    </b-row>

    <b-row v-if="!tableLength" class="mx-0 mb-2">
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
        @filtered="onFiltered"
        :filter-function="dateFilter"
        :sort-by.sync="table.sortBy"
        :sort-desc.sync="table.sortDesc"
        :sort-direction="table.sortDirection"
        :selectable="table.selectable"
        :select-mode="table.selectMode"
        :tbody-tr-class="rowClass"
        :busy="table.isBusy"
        @row-clicked="onRowClicked"
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
        <template v-slot:empty>
          <b-row class="mx-0 mb-2">
            <hr class="w-100 m-0 mb-5">
            <img :src="images.logo" class="mt-5 mx-auto d-block" alt="logo">
          </b-row>
        </template>
        <template v-slot:emptyfiltered>
          <b-row class="mx-0 mb-2">
            <hr class="w-100 m-0 mb-5">
            <img :src="images.logo" class="mt-5 mx-auto d-block" alt="logo">
          </b-row>
        </template>
      </b-table>
    </b-row>

  </b-container>
</template>

<script>
import moment from 'moment';
import { mails } from '../mock/mails';
import { tableConfig } from '../config/index';
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
        items: mails,
        inputProps: {
          placeholder: "",
          readonly: true
        },
        images: {
          calenderIcon: cIcon,
          searchIcon: cSearch,
          logo: mailArchiverLogo,
          clipIcon: cClip
        },
        datePicker: {
          attrs: [
            {},
          ],
          available: {
            start: moment().subtract(2, 'years').toDate(),
            end: moment().toDate()
          },
          range: {
            start: moment().startOf('day').toDate(),
            end: moment().toDate()
          },
          dragValue: null
        },
        table: tableConfig,
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
      },
      selectDragAttribute() {
        return {
          popover: {
            visibility: 'hover',
            isInteractive: false, // Defaults to true when using slot
          },
        };
      },
      computedRange: {
        get() {
          return this.datePicker.range;
        },
        set(range) {
          this.datePicker.range = {start: range.start, end: moment(range.end, moment.defaultFormat).endOf('day').toDate()};
        }
      },
      tableLength() {
        return this.table.totalRows;
      }
    },
    mounted() {
      this.table.totalRows = this.items.length
    },
    methods: {
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
        this.table.filter = this.datePicker.range;
      },
      getAllMails() {
        this.table.filter = this.datePicker.available;
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
      },
      dateFilter(item, filter){
        let start =  filter.start;
        let end =  filter.end;
        let date = moment.unix(item.date).local();
        start = moment(start).startOf('day').utc().local();
        end = moment(end).utc().local();
        let btw = moment(date).isBetween(start, end, null, '[]');
        return btw;
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
