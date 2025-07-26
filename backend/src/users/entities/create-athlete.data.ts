/** This entity represents the column names and data types of 
 * Athlete data being inserted into the table.
 */
interface CreateAthleteData {
    user_id: number;
    federation_id?: string;
    division_id?: string;
    weight_class_id?: string;
    team?: string;
  }