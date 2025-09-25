import activityData from "@/services/mockData/activities.json";

let activities = [...activityData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activityService = {
  async getAll() {
    await delay(300);
    return [...activities].sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async getById(id) {
    await delay(200);
    const activity = activities.find(a => a.Id === parseInt(id));
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  },

  async create(activityData) {
    await delay(400);
    const maxId = Math.max(...activities.map(a => a.Id), 0);
    const newActivity = {
      ...activityData,
      Id: maxId + 1,
      contactId: parseInt(activityData.contactId),
      dealId: activityData.dealId ? parseInt(activityData.dealId) : null,
      createdAt: new Date().toISOString()
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  async update(id, activityData) {
    await delay(350);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    const updatedActivity = {
      ...activities[index],
      ...activityData,
      Id: parseInt(id),
      contactId: parseInt(activityData.contactId),
      dealId: activityData.dealId ? parseInt(activityData.dealId) : null
    };
    
    activities[index] = updatedActivity;
    return { ...updatedActivity };
  },

  async delete(id) {
    await delay(250);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    const deletedActivity = { ...activities[index] };
    activities.splice(index, 1);
    return deletedActivity;
  },

  async getByContactId(contactId) {
    await delay(200);
    return activities
      .filter(activity => activity.contactId === parseInt(contactId))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async getByDealId(dealId) {
    await delay(200);
    return activities
      .filter(activity => activity.dealId === parseInt(dealId))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async getRecent(limit = 10) {
    await delay(200);
    return [...activities]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }
};