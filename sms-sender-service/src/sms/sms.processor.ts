import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { SmsDto } from "./dto/sms.dto";
import axios from "axios";

@Processor(process.env.QUEUE_NAME)
export class SmsProcessor {
  @Process()
  async sendSMS(job: Job) {
    console.log("Sending SMS");
    const smsData: SmsDto = job.data;
    try {
      let str = smsData.phoneNumber;
      let result = str.substring(2);
      const url = "https://www.intouchsms.co.rw/api/sendsms/.json";
      const data = new URLSearchParams();
      data.append("recipients", result);
      data.append("message", smsData.message);
      data.append("sender", process.env.SMSSENDERID);

      const auth = {
        username: process.env.SMSUSERNAME,
        password: process.env.SMSPASSWORD,
      };

      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
      };

      const response = await axios.post(url, data, {
        auth,
        headers,
      });

      console.log(response.data);
    } catch (e) {
      console.log(
        "------------------------------------------start of error------------------------------------------",
      );
      console.log(e);
      console.log(
        "------------------------------------------end of error------------------------------------------",
      );
      throw e; // Throw the error so that the job can be retried
    }
  }
}
