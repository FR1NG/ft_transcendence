import { defineStore } from 'pinia';
import axios from '@/plugins/axios';
import { Invitation, InvitationType } from '@/types/invitation';
import { AxiosResponse } from 'axios';
import { pushNotify } from '@/composables/simpleNotify';

export const useInvitationStore = defineStore('invitation', {
  state: () => ({
    invitation: {} as Invitation,
  }),
  getters: {

  },
  actions: {
    // create invitation
    async createInvitation(userId: string, type: InvitationType) {
      return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.post('/invitation', {
            userId,
            type,
          });
          const { data } = response;
          resolve(data);
        } catch (error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response);
        }
      });
    },

    // getting the invitation
    async getInvitation(id: string):Promise<Invitation> {
      return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.get(`/invitation/${id}`)
          const { data } = response;
          this.invitation = data;
          resolve(data);
        } catch(error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error?.response)
        }
      })
    },


    // accept invitation
    async acceptInvitation(id: string) {
      return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.post(`/invitation/accept/${id}`);
          const { data } = response;
          resolve(data);
        } catch (error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response);
        }
      });
    },

    // decline invitation
    async declineInvitation(id: string) {
      return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.post(`/invitation/decline/${id}`);
          const { data } = response;
          resolve(data);
        } catch (error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response);
        }
      });
    }
  }// end of actions
}); // end of store
