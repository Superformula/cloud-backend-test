

export const user = {
    async createUser(parent: any, args: any, context: any, info: any) {
      console.log(parent, args, context, info);
      
      

      return Promise.resolve({});
    },
  
    async updateUser(parent: any, args: any, context: any, info: any) {
      
      
      return Promise.resolve({});
    },

    async deleteUser(parent: any, args: any, context: any, info: any) {
      
      

      return Promise.resolve(true);
      },
  }