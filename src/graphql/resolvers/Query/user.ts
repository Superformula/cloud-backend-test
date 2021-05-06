

export const user = {
    async users(parent: any, args: any, context: any, info: any) {
        

        return Promise.resolve([{
          _id: "test",
          name: "test",
          dob: "test",
          address: {
            place: "test",
            latitude: 20,
            longitude: 12
          },
          description: "test",
          createdAt: "test",
          updatedAt: "test",
          imageUrl: "test",

        }]);
    },
  
    async geolocate(parent: any, args: any, context: any, info: any) {
        console.log(parent, args, context, info);
      
  
        return Promise.resolve([{}]);
    },
  }