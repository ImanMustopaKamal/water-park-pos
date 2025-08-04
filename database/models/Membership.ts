export interface Membership {
  id: number;
  category_id: number;
  category_name: string;
  code: string;
  name: string;
  description: string;
  status: number;
  start_at: string;
  end_at: string;
}

export interface MembershipCreate {
  category_id: number;
  name: string;
  description: string;
  code: string;
}
