import { DataSource } from "apollo-datasource";
import { MessagePayload, MessageResponse, MessagingService } from 'marioruizdiaz-messaging';

export class MessagingConnector extends DataSource {
    
    private SERVICE_NAME: string = 'Mario Ruiz Diaz GrapQL Service';
    constructor() {
        super();
    }

    public static async InitilizeCommunication() : Promise<void>{
        await MessagingService.init(
          process.env.MESSAGING_TIMEOUT,
          process.env.MESSAGING_URL as string, process.env.MESSAGING_PORT as string,
          process.env.MESSAGING_USER as string, process.env.MESSAGING_PASSWORD as string)
          .then(() =>{
            console.log('Micro services messaging component initialized!');
          })
          .catch(ex => {
              console.error('Micro services messaging component failed to initialize!', ex);
              throw ex;
          });
        
        return Promise.resolve();
      
      }

    public async Request(subject: string, payload: MessagePayload): Promise<MessageResponse>{
        return await MessagingService.request(this.SERVICE_NAME, subject, payload);
    }
  
}