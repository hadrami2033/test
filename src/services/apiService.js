import http from "../http-common";

class MGMService {

  // Conventions
  getConventions(){
    return http.get(`/conventions`);
  }
  getConvention(id){
    return http.get(`/conventions/${id}`);
  }

  addConvention(data){
    return http.post(`/conventions`, data);
  }

  updateConvention(data){
    return http.put(`/conventions/${data.id}`, data);
  }

  deleteConvention(id){
    return http.delete(`/conventions/${id}`);
  }

  // Commitments
  getCommitments(){
    return http.get(`/commitments`);
  }
  getCommitment(id){
    return http.get(`/commitments/${id}`);
  }

  addCommitment(data){
    return http.post(`/commitments`, data);
  }

  updateCommitment(data){
    return http.put(`/commitments/${data.id}`, data);
  }

  deleteCommitment(id){
    return http.delete(`/commitments/${id}`);
  }

  addCommitmentAmount(data){
    return http.post(`/commitmentamounts`, data);
  }

  deleteCommitmenAmount(id){
    return http.delete(`/commitmentamounts/${id}`);
  }


  // Contractors
  getContractors(){
    return http.get(`/contractors`);
  }
  getContractor(id){
    return http.get(`/contractors/${id}`);
  }
  addContractor(data){
    return http.post(`/contractors`, data);
  }
  updateContractor(data){
    return http.put(`/contractors/${data.id}`, data);
  }
  deleteContractor(id){
    return http.delete(`/contractors/${id}`);
  }


    // Contractors
    getContractors(){
      return http.get(`/contractors`);
    }
    getContractor(id){
      return http.get(`/contractors/${id}`);
    }
    addContractor(data){
      return http.post(`/contractors`, data);
    }
    updateContractor(data){
      return http.put(`/contractors/${data.id}`, data);
    }
    deleteContractor(id){
      return http.delete(`/contractors/${id}`);
    }

    // CategorieType
    getCategoriesType(){
      return http.get(`/categoriestype`);
    }
    getCategorieType(id){
      return http.get(`/categoriestype/${id}`);
    }
    addCategorieType(data){
      return http.post(`/categoriestype`, data);
    }
    updateCategorieType(data){
      return http.put(`/categoriestype/${data.id}`, data);
    }
    deleteCategorieType(id){
      return http.delete(`/categoriestype/${id}`);
    }

  // Disbursement type
  getDisbursementsTypes(){
    return http.get(`/disbursementtypes`);
  }
  getDisbursementType(id){
    return http.get(`/disbursementtypes/${id}`);
  }
  addDisbursementType(data){
    return http.post(`/disbursementtypes`, data);
  }
  updateDisbursementType(data){
    return http.put(`/disbursementtypes/${data.id}`, data);
  }
  deleteDisbursementType(id){
    return http.delete(`/disbursementtypes/${id}`);
  }

  // Spendings
  getConventionSpendings(){
    return http.get(`/conventionspendings`);
  }

  // Invoices
  getInvoices(){
    return http.get(`/invoices`);
  }
  getInvoice(id){
    return http.get(`/invoices/${id}`);
  }

  //catgories
  addCategorie(data){
    return http.post(`/categories`, data);
  }
  updateCategorie(data){
    return http.put(`/categories/${data.id}`, data);
  }

  //deadlines
  addDeadline(data){
    return http.post(`/deadlines`, data);
  }
  updateDeadline(data){
    return http.put(`/deadlines/${data.id}`, data);
  }

  addInvoiceLine(data){
    return http.post(`/invoicelines`, data);
  }

  deleteInvoiceLine(id){
    return http.delete(`/invoicelines/${id}`);
  }

  addInvoice(data){
    return http.post(`/invoices`, data);
  }

  updateInvoice(data){
    return http.put(`/invoices/${data.id}`, data);
  }

  deleteInvoice(id){
    return http.delete(`/invoices/${id}`);
  }

  // Deadlines
  getConventionDeadlines(){
    return http.get(`/deadlines`);
  }

  /// Dusbursments
  getDisbursements(){
    return http.get(`/disbursements`);
  }
  addDisbursement(data){
    return http.post(`/disbursements`, data);
  }
  updateDisbursement(data){
    return http.put(`/disbursements/${data.id}`, data);
  }

  // Type de status
  getStatusType(){
    return http.get(`/statustype`);
  }
  getStatusTypeById(id){
    return http.get(`/statustype/${id}`);
  }
  addStatusType(data){
    return http.post(`/statustype`, data);
  }
  updateStatusType(data){
    return http.put(`/statustype/${data.id}`, data);
  }
  deleteStatusType(id){
    return http.delete(`/statustype/${id}`);
  }



  addStatus(data){
    return http.post(`/states`, data);
  }

  /// Funders
  getFunders(){
    return http.get(`/funders`);
  }
  getFunder(id){
    return http.get(`/funders/${id}`);
  }
  addFunder(data){
    return http.post(`/funders`, data);
  }
  updateFunder(data){
    return http.put(`/funders/${data.id}`, data);
  }
  deleteFunder(id){
    return http.delete(`/funders/${id}`);
  }

  // Borrowers
  getBorrowers(){
    return http.get(`/borrowers`);
  }
  getBorrower(id){
    return http.get(`/borrowers/${id}`);
  }
  addBorrower(data){
    return http.post(`/borrowers`, data);
  }
  updateBorrower(data){
    return http.put(`/borrowers/${data.id}`, data);
  }
  deleteBorrower(id){
    return http.delete(`/borrowers/${id}`);
  }

  // Currency
  getCurrencies(){
    return http.get(`/currencies`);
  }
  getCurrency(id){
    return http.get(`/currencies/${id}`);
  }
  addCurrency(data){
    return http.post(`/currencies`, data);
  }
  updateCurrency(data){
    return http.put(`/currencies/${data.id}`, data);
  }
  deleteCurrency(id){
    return http.delete(`/currencies/${id}`);
  }


  //SpendingType
  getSpendingsTypes(){
    return http.get(`/spendingtypes`);
  }
  addSpendingsType(data){
    return http.post(`/spendingtypes`, data);
  }
  getSpendingType(id){
    return http.get(`/spendingtypes/${id}`);
  }
  updateSpendingType(data){
    return http.put(`/spendingtypes/${data.id}`, data);
  }
  deleteSpendingType(id){
    return http.delete(`/spendingtypes/${id}`);
  }


  // USERS
  login(phone, password) {
    return http.get(`/users/${phone}/${password}`);
  }

  newUser(data) {
    return http.post("/users/add", data);
  }

  getUsers() {
    return http.get("/users/allUsers");
  }

}

export default new MGMService();