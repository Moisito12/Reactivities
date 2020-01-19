import { toast } from 'react-toastify';
import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";
import { history } from '../..';

configure({ enforceActions: "always" });

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
  };

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
        (a, b) => a.date.getTime() - b.date.getTime()
    )
    return Object.entries(sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split('T')[0];
        activities[date] = activities[date] ? [...activities[date], activity] : [activity];
        return activities;
    }, {} as {[key: string]: IActivity[]}));
  };

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction("load activities", () => {
        activities.forEach(activity => {
          activity.date = new Date(activity.date);

          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("load activities error", () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction("getiing activity", () => {
          activity.date = new Date(activity.date)
          this.activity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });
        return activity;
      } catch (error) {
        runInAction("getiing activity error", () => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction("Creat a activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`)
    } catch (error) {
      runInAction("Creat a activity error", () => {
        this.submitting = false;
      });
      toast.error('Problem submitting data');
      console.log(error.response);
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("edit activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`)
    } catch (error) {
      runInAction("edit Activity error ", () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction("Delete Activity", () => {
        this.activityRegistry.delete(id);
        this.submitting = true;
        this.target = "";
      });
    } catch (error) {
      runInAction("Delete activity error", () => {
        this.submitting = true;
        this.target = "";
        console.log(error);
      });
    }
  };

  @action openCreateForm = () => {
    this.activity = null;
  };

  @action openEditForm = (id: string) => {
    this.activity = this.activityRegistry.get(id);
  };
}

export default createContext(new ActivityStore());
