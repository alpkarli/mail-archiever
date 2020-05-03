

<template>
  <b-container fluid class="px-auto">
    <!-- User Interface controls -->

    <b-row class="mx-0 my-3">

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
            <!--Custom Input Slot-->
            <input
            size="md"
            class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 hover:border-blue-5 text-right"
              id="date"
              slot-scope="{ inputProps, inputEvents }"
              :style="{backgroundImage: `url(${images.calenderIcon})`, backgroundPosition: '10px 10px', backgroundRepeat: 'no-repeat', backgroundSize: '19px'}"
              v-bind="inputProps"
              v-on="inputEvents">
          </v-date-picker>
          <b-input-group-append>
            <b-button class="w-100"
          type="button"
          variant="light"
          @click="log()"><span aria-hidden="true" class="mx-2 d-block" :style="{backgroundImage: `url(${images.searchIcon})`, width: '16px', height:'16px'}"></span></b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

    </b-row>

    <b-row class="mx-0 font-weight-bold">
      <p>Results: {{ items.length }} mail(s)</p>
    </b-row>

    <b-row v-if="!empty.length" class="mx-0 mb-2">
      <hr class="w-100 m-0 mb-5">
      <img :src="images.logo" class="mt-5 mx-auto d-block" alt="logo">
    </b-row>

    <b-row v-else class="mx-0 mb-2">
      <b-table
        show-empty
        
        fixed
        striped
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :filterIncludedFields="filterOn"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection"
        selectable
        :select-mode="selectMode"
        @row-selected="onRowSelected"
        @filtered="onFiltered"
        responsive="sm">
        <template v-slot:items="scope">
          <h4>{{ scope.items }}</h4>
        </template>
      </b-table>
    </b-row>

    <!---
    <b-row>

      <b-col lg="6" class="my-1">

        <b-form-group
          label="Filter"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          label-for="filterInput"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder="Type to Search"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col lg="6" class="my-1">
        <b-form-group
          label="Filter On"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          description="Leave all unchecked to filter on all data"
          class="mb-0">
          <b-form-checkbox-group v-model="filterOn" class="mt-1">
            <b-form-checkbox value="name">Name</b-form-checkbox>
            <b-form-checkbox value="age">Age</b-form-checkbox>
            <b-form-checkbox value="isActive">Active</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
      </b-col>

      <b-col sm="5" md="6" class="my-1">
        <b-form-group
          label="Per page"
          label-cols-sm="6"
          label-cols-md="4"
          label-cols-lg="3"
          label-align-sm="right"
          label-size="sm"
          label-for="perPageSelect"
          class="mb-0"
        >
          <b-form-select
            v-model="perPage"
            id="perPageSelect"
            size="sm"
            :options="pageOptions"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col sm="7" md="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row>
-->
    <!-- Main table element -->
    

    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </b-container>
</template>

<script>
import cIcon from '@/assets/icon_calender.svg';
import cSearch from '@/assets/icon_search.svg';
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
          { from: 'aaa@example.com', to: 'zzz.zzz@example.com', subject: '[ HR-888 ] Notice of official announcement', date: '1586320356' },
          { from: 'bbb.bbbb@example.com', to: 'yyy@example.com', subject: '[web:333] "Web Contact"', date: '1586320356' },
          {
            from: 'ccc@example.com',
            to: ['xxx@example.com', 'aaa@example.com'],
            subject: 'Happy New Year! Greetings for the New Year.', date: '1586320356',
            _rowVariant: 'success'
          },
          {
            from: 'ddd.dddd@example.com',
            to: ['vvv.vvv@example.com', 'jjj.jjj@example.com'],
            subject: '[HR-887(Revised: Office Expansion Project Team)] Notice of off...', date: '1586320356',
            _cellVariants: { from: 'danger', to: 'warning' }
          },
          { from: 'eee@example.com', to: ['sss@example.com', 'nmn@example.com', 'mnm@example.com'], subject: '[Github] Logout page', date: '1586320356' },
          { from: 'fff.ffff@example.com', to: 'qqq.qqq@example.com', subject: '［dev］ Postfix 3.1.12 / 3.2.9 / 3.3.4 / 3.4.5', date: '1586320356' },
          { from: 'ggg@example.com', to: 'ppp@example.com', subject: 'Re: [Github] Brush-up on loading animation ', date: '1586320356' },
          { from: 'hhh.hhh@example.com', to: 'ooo.ooo@example.com', subject: 'Workplace Summary for sample, Inc.: Jun 2 - Jun 9', date: '1586320356' },
          { from: 'iii@example.com', to: 'nnn@example.com', subject: 'I love you', date: '1586320356' },
          { from: 'Pablo-Diego-Jose-Francisco@example.com', to: 'Pablo-Diego-Jose-Francisco@example.com', subject: '[info:888] ABC EQUIPMENT COMPANY', date: '1586320356' },
        ],
        fields: [
          { key: 'from', label: 'From', sortable: true, sortDirection: 'desc' },
          { key: 'to', label: 'To', sortable: true, class: 'text-center',
            formatter: value => {
              if (Array.isArray(value)) {
                return Array.prototype.join.call(value, ", ");
              } else {
                return value;
              }
            }
          },
          {
            key: 'subject',
            label: 'Subject',
            /* formatter: (value, key, item) => {
              return value ? 'Yes' : 'No'
            },  icon ekle */
            sortable: true,
            sortByFormatted: true,
            filterByFormatted: true
          },
          { key: 'date', label: 'Date' }
        ],
        totalRows: 1,
        currentPage: 1,
        perPage: 5,
        pageOptions: [5, 10, 15],
        sortBy: '',
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
        filterOn: [],
        infoModal: {
          id: 'info-modal',
          title: '',
          content: ''
        },
        selectMode: 'multi',
        selected: [],
        
        inputProps: {
          placeholder: ""
        },
        

        images: {
          calenderIcon: cIcon,
          searchIcon: cSearch,
          logo: mailArchiverLogo,
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

        }
      }
    },
    computed: {
      sortOptions() {
        // Create an options list from our fields
        return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
      }
    },
    mounted() {
      // Set the initial number of items
      this.totalRows = this.items.length
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
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      onRowSelected(items) {
        this.selected = items
      },
      multipleComma(items) {
        if (items.length > 1) {
          console.log(items);
          
          return Array.prototype.join.call(items, ", ");
        } else {
          return items;
        }
      },
      log(){
        console.log("log");
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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

</style>
