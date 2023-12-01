import { sql } from "@vercel/postgres";
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { score, name } = await request.json();
  console.log(score, name);
  const result = await sql`INSERT INTO scores (score, user_id) VALUES (${score}, ${name})`
  return json(result);
};