export default {

    isSuperUser: false,
    permissions: null,


    /**
     * 有任何权限
     *
     */
    hasAnyAccess(permissions){
        return this.hasAccess(permissions, false);
    },

    /**
     * 有所有权限
     *
     */
    hasAccess(permissions, all = true){
        if (this.isSuperUser) { // 主账号
            return true;
        }
        return this.hasPermission(permissions, all);
    },



    /**
     * 是否有权限
     * @param $permissions 多个权限
     * @param $all 多个权限都满足
     *
     */
    hasPermission(permissions, all = true){
        if ((typeof permissions) == "string") {
           permissions = [permissions];
        }
        for(let i=0;i<permissions.length;i++){
          let permission = permissions[i];
          let matched = false;
          // 满足其中一种情况
          if ((permission.length > 1) && permission.indexOf('*') == permission.length-1) {  // 匹配  order.*
              for(let k=0;k<this.permissions.length;k++){
                let ownPermission = this.permissions[k];
                let checkPermission = permission.substr(0, permission.length-1);  // 去掉 *
                if (checkPermission != ownPermission && ownPermission.indexOf(checkPermission) == 0) {
                    matched = true;
                    break;
                }
              }
          }else if((permission.length > 1) && permission.indexOf('*') == 0) {   // 匹配  *.update
              for(let k=0;k<this.permissions.length;k++){
                let ownPermission = this.permissions[k];
                let checkPermission = permission.substr(1); // 去掉 *
                if (checkPermission != ownPermission && ownPermission.indexOf(checkPermission) == 1) {
                    matched = true;
                    break;
                }
              }
          }else{   // 完全匹配
              for(let k=0;k<this.permissions.length;k++){
                let ownPermission = this.permissions[k];
                if (permission == ownPermission) {
                    matched = true;
                    break;
                }
              }
          }
          // 其中一个权限没有
          if (all === true && matched === false) {
              return false;
          }else if (all === false && matched === true) {  // 有其中一个
              return true;
          }
        }

        return !(all === false); // 都有 或者 都没有
    }

}
