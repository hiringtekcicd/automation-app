//make interface for analytics, not model (no functions)
//TODO put this in separate file
export interface analytics_data{
    firstTimestamp: Date,
    lastTimestamp: Date,
    length: Number,
    sensor_info: sensor_data[]
  }
export interface sensor_data{
    _id: Date,
    sensors:sensor_details[]
  }
  
  interface sensor_details{
    name:string,
    value:Number
  }