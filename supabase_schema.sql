-- 1. Create buses table for Shanmuga Bus App
CREATE TABLE IF NOT EXISTS public.buses (
  number INTEGER PRIMARY KEY,
  driver TEXT DEFAULT '',
  contact TEXT DEFAULT '98765 43210',
  route TEXT DEFAULT '',
  photo TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies for Public Access (Read & Write)
DROP POLICY IF EXISTS "Public select buses" ON public.buses;
CREATE POLICY "Public select buses" ON public.buses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert buses" ON public.buses;
CREATE POLICY "Public insert buses" ON public.buses FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update buses" ON public.buses;
CREATE POLICY "Public update buses" ON public.buses FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public delete buses" ON public.buses;
CREATE POLICY "Public delete buses" ON public.buses FOR DELETE USING (true);

-- 4. Pre-populate initial 50 Tiruvannamalai Campus Buses into Supabase
INSERT INTO public.buses (number, driver, contact, route, photo) VALUES
  (1, 'R. Kumar', '98765 43210', 'Polur ➔ Campus', ''),
  (2, 'M. Suresh', '98765 43210', 'Chengam ➔ Campus', ''),
  (3, 'K. Ramesh', '98765 43210', 'Kilpennathur ➔ Campus', ''),
  (4, 'S. Murugan', '98765 43210', 'Avalurpet ➔ Campus', ''),
  (5, 'A. Venkatesh', '98765 43210', 'Desur ➔ Campus', ''),
  (6, 'P. Elumalai', '98765 43210', 'Gingee ➔ Campus', ''),
  (7, 'G. Sekar', '98765 43210', 'Thirukoilur ➔ Campus', ''),
  (8, 'T. Rajan', '98765 43210', 'Vettavalam ➔ Campus', ''),
  (9, 'V. Prakash', '98765 43210', 'Manalurpet ➔ Campus', ''),
  (10, 'C. Balan', '98765 43210', 'Kalasapakkam ➔ Campus', ''),
  (11, 'D. Senthil', '98765 43210', 'Veraiyur ➔ Campus', ''),
  (12, 'J. Mohan', '98765 43210', 'Kandamangalam ➔ Campus', ''),
  (13, 'K. Arumugam', '98765 43210', 'Arani ➔ Campus', ''),
  (14, 'N. Saravanan', '98765 43210', 'Vandavasi ➔ Campus', ''),
  (15, 'M. Ganesan', '98765 43210', 'Cheyyar ➔ Campus', ''),
  (16, 'P. Manikandan', '98765 43210', 'Sathanur Dam ➔ Campus', ''),
  (17, 'R. Vijay', '98765 43210', 'Thanipadi ➔ Campus', ''),
  (18, 'S. Karthik', '98765 43210', 'Sankarapuram ➔ Campus', ''),
  (19, 'T. Dinesh', '98765 43210', 'Kallakurichi ➔ Campus', ''),
  (20, 'A. Anand', '98765 43210', 'Villupuram ➔ Campus', ''),
  (21, 'V. Shankar', '98765 43210', 'Tindivanam ➔ Campus', ''),
  (22, 'K. Palani', '98765 43210', 'Kanchipuram ➔ Campus', ''),
  (23, 'E. Selvam', '98765 43210', 'Vellore ➔ Campus', ''),
  (24, 'R. Mani', '98765 43210', 'Gudiyattam ➔ Campus', ''),
  (25, 'M. Velu', '98765 43210', 'Ambur ➔ Campus', ''),
  (26, 'G. Pandian', '98765 43210', 'Vaniyambadi ➔ Campus', ''),
  (27, 'P. Kuberan', '98765 43210', 'Tirupattur ➔ Campus', ''),
  (28, 'S. Baskaran', '98765 43210', 'Harur ➔ Campus', ''),
  (29, 'T. Gopal', '98765 43210', 'Uttangarai ➔ Campus', ''),
  (30, 'D. Sundar', '98765 43210', 'Dharmapuri ➔ Campus', ''),
  (31, 'K. Natarajan', '98765 43210', 'Salem ➔ Campus', ''),
  (32, 'M. Murugesan', '98765 43210', 'Pondicherry ➔ Campus', ''),
  (33, 'A. Radhakrishnan', '98765 43210', 'Cuddalore ➔ Campus', ''),
  (34, 'V. Gunasekar', '98765 43210', 'Panruti ➔ Campus', ''),
  (35, 'C. Krishnamoorthy', '98765 43210', 'Neyveli ➔ Campus', ''),
  (36, 'E. Pachaiyappan', '98765 43210', 'Vriddhachalam ➔ Campus', ''),
  (37, 'R. Govindan', '98765 43210', 'Ulundurpet ➔ Campus', ''),
  (38, 'S. Balasubramanian', '98765 43210', 'Elavanasur ➔ Campus', ''),
  (39, 'T. Ramalingam', '98765 43210', 'Rishivandiyam ➔ Campus', ''),
  (40, 'P. Jayabalan', '98765 43210', 'Sembadavanur ➔ Campus', ''),
  (41, 'K. Srinivasan', '98765 43210', 'Pudupalayam ➔ Campus', ''),
  (42, 'M. Ramachandran', '98765 43210', 'Thurinjapuram ➔ Campus', ''),
  (43, 'A. Dhanasekaran', '98765 43210', 'Naidu Mangalam ➔ Campus', ''),
  (44, 'V. Loganathan', '98765 43210', 'Vengikkal ➔ Campus', ''),
  (45, 'C. Sambandam', '98765 43210', 'Mathur ➔ Campus', ''),
  (46, 'E. Thirunavukkarasu', '98765 43210', 'Mangalam ➔ Campus', ''),
  (47, 'R. Venkatesan', '98765 43210', 'Anakkavoor ➔ Campus', ''),
  (48, 'S. Jayaraman', '98765 43210', 'Thellar ➔ Campus', ''),
  (49, 'T. Subramanian', '98765 43210', 'Peranamallur ➔ Campus', ''),
  (50, 'P. Chandran', '98765 43210', 'Chetpet ➔ Campus', '')
ON CONFLICT (number) DO NOTHING;
