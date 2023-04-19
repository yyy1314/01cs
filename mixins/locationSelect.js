import { getProvince, getCity, getArea } from '@/api/enterprise.js';
const collect = require('collect.js');
export default {
  data: function () {
    return {
      locations: {
        lazy: true,
        lazyLoad: this.loadArea
      }
    }
  },
  methods: {
    loadArea: function(node, resolve) {
      let that = this;
      const { level } = node;
      let nodes = [];
      setTimeout(() => {
        if(level == 0){
          getProvince({}).then(e => {
              collect(e.res).each((item,index)=>{
                nodes.push({                
                  value: item.code,
                  label: item.name,
                  leaf: level >= 2,
                });
              });
              resolve(nodes);
          });
        }else if(level == 1){
          getCity({province_code:node.value}).then(e => {
              collect(e.res).each((item,index)=>{
                nodes.push({ 
                  value: item.code,
                  label: item.name,
                  leaf: level >= 2,
                });
              });
              resolve(nodes);
          });
        }else if(level == 2){
          getArea({city_code:node.value}).then(e => {
              collect(e.res).each((item,index)=>{
                nodes.push({
                  value: item.code,
                  label: item.name,
                  leaf: level >= 2,
                });
              });
              resolve(nodes);
          });
        }
    
      }, 100);
    },
  }
}
