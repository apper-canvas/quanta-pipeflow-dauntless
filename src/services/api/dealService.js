import dealData from "@/services/mockData/deals.json";

let deals = [...dealData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dealService = {
  async getAll() {
    await delay(300);
    return [...deals];
  },

  async getById(id) {
    await delay(200);
    const deal = deals.find(d => d.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  },

  async create(dealData) {
    await delay(400);
    const maxId = Math.max(...deals.map(d => d.Id), 0);
    const newDeal = {
      ...dealData,
      Id: maxId + 1,
      contactId: parseInt(dealData.contactId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, dealData) {
    await delay(350);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    const updatedDeal = {
      ...deals[index],
      ...dealData,
      Id: parseInt(id),
      contactId: dealData.contactId ? parseInt(dealData.contactId) : deals[index].contactId,
      updatedAt: new Date().toISOString()
    };
    
    deals[index] = updatedDeal;
    return { ...updatedDeal };
  },

  async delete(id) {
    await delay(250);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    const deletedDeal = { ...deals[index] };
    deals.splice(index, 1);
    return deletedDeal;
  },

  async getByContactId(contactId) {
    await delay(200);
    return deals.filter(deal => deal.contactId === parseInt(contactId));
  },

  async getByStage(stage) {
    await delay(200);
    return deals.filter(deal => deal.stage === stage);
  },

  async updateStage(id, stage) {
    await delay(300);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    deals[index] = {
      ...deals[index],
      stage,
      updatedAt: new Date().toISOString()
    };
    
    return { ...deals[index] };
  }
};