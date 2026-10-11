import { LaunchModel, ILaunch } from '../models/launches';
import { HydratedDocument } from 'mongoose';

export class LaunchService {

  async getAllLaunches(): Promise<ILaunch[]> {
    return await LaunchModel.find().lean(); 
  }

  async getLaunchById(id: string): Promise<ILaunch | null> {
    return await LaunchModel.findById(id).lean();
  }

  async createLaunch(launchData: ILaunch): Promise<HydratedDocument<ILaunch>> {
    const launch = new LaunchModel(launchData);
    return await launch.save();
  }

  async updateLaunch(id: string, launchData: Partial<ILaunch>): Promise<ILaunch | null> {
    return await LaunchModel.findByIdAndUpdate(id, launchData, { returnDocument: 'after' }).lean();
  }

  async deleteLaunch(id: string): Promise<ILaunch | null> {
    return await LaunchModel.findByIdAndDelete(id).lean();
  }

  async getUpcomingLaunches(): Promise<ILaunch[]> {
  return await LaunchModel.find({ date: { $gte: new Date() } })
    .sort({ date: 1 })
    .lean();
  }
  
  async setFavorite(id: string, favorite: boolean): Promise<ILaunch | null> {
    return await LaunchModel.findByIdAndUpdate(id, { favorite }, { returnDocument: 'after', runValidators: true }).lean();
  }
}
